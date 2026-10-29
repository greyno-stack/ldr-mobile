import crypto from "crypto";
import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import {generateToken} from "../lib/utils.js";
import { sendVerificationEmail } from "../lib/mailer.js";

const CODE_TTL_MINUTES = 10;
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_CODE_ATTEMPTS = 5;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizeEmail = (email) => String(email).trim().toLowerCase();

const generateCode = () => crypto.randomInt(0, 1_000_000).toString().padStart(6, "0");

// HMAC keyed with the server secret, so a leaked row can't be brute-forced offline.
const hashCode = (email, code) =>
    crypto.createHmac("sha256", process.env.JWT_SECRET).update(`${email}:${code}`).digest("hex");

const codesMatch = (a, b) => {
    const bufA = Buffer.from(a, "hex");
    const bufB = Buffer.from(b, "hex");
    return bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB);
};

const secondsUntilResend = (pending) => {
    const elapsed = (Date.now() - pending.lastSentAt.getTime()) / 1000;
    return Math.max(0, Math.ceil(RESEND_COOLDOWN_SECONDS - elapsed));
};

// Stores a fresh code for the pending signup and emails it. If the email fails to send,
// the cooldown is cleared so the user can retry immediately.
async function issueCode(email, { username, password }) {
    const code = generateCode();
    const codeHash = hashCode(email, code);
    const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000);

    await prisma.pendingSignup.upsert({
        where: { email },
        create: { email, username, password, codeHash, expiresAt },
        update: { username, password, codeHash, expiresAt, attempts: 0, lastSentAt: new Date() },
    });

    try {
        await sendVerificationEmail(email, code, CODE_TTL_MINUTES);
    } catch (error) {
        await prisma.pendingSignup.update({ where: { email }, data: { lastSentAt: new Date(0) } });
        throw error;
    }
}

const signupResponse = (email) => ({
    email,
    expiresInSeconds: CODE_TTL_MINUTES * 60,
    resendCooldownSeconds: RESEND_COOLDOWN_SECONDS,
});

export async function signup(req,res) {
    try {
        const { username, password } = req.body;
        if(!username || !req.body.email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        const email = normalizeEmail(req.body.email);
        const trimmedUsername = String(username).trim();

        if (!trimmedUsername) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if (!EMAIL_PATTERN.test(email)) {
            return res.status(400).json({ error: "Please enter a valid email address" });
        }
        if(password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email: { equals: email, mode: "insensitive" } }, { username: trimmedUsername }] },
        });

        if (existingUser) {
            const emailTaken = existingUser.email.toLowerCase() === email;
            return res.status(400).json({ error: emailTaken ? "User already exists" : "Username is already taken" });
        }

        // Someone else mid-verification with this username would collide when they finish.
        const usernameHeld = await prisma.pendingSignup.findFirst({
            where: { username: trimmedUsername, email: { not: email }, expiresAt: { gt: new Date() } },
        });
        if (usernameHeld) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const pending = await prisma.pendingSignup.findUnique({ where: { email } });
        if (pending) {
            const wait = secondsUntilResend(pending);
            if (wait > 0) {
                return res.status(429).json({
                    error: `Please wait ${wait}s before requesting another code`,
                    retryAfterSeconds: wait,
                });
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        try {
            await issueCode(email, { username: trimmedUsername, password: hashedPassword });
        } catch (error) {
            console.log("Error sending verification email:", error);
            return res.status(500).json({ error: "Couldn't send the verification email. Please try again." });
        }

        // Opportunistic cleanup of abandoned signups.
        prisma.pendingSignup
            .deleteMany({ where: { expiresAt: { lt: new Date(Date.now() - 24 * 60 * 60 * 1000) } } })
            .catch(() => {});

        res.status(200).json(signupResponse(email));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error creating user" });
    }
};

export async function verifyEmail(req, res) {
    try {
        if (!req.body.email || !req.body.code) {
            return res.status(400).json({ error: "Email and code are required" });
        }
        const email = normalizeEmail(req.body.email);
        const code = String(req.body.code).trim();

        if (!/^\d{6}$/.test(code)) {
            return res.status(400).json({ error: "Enter the 6-digit code" });
        }

        const pending = await prisma.pendingSignup.findUnique({ where: { email } });
        if (!pending) {
            return res.status(400).json({ error: "No pending signup for this email. Please sign up again." });
        }
        if (pending.expiresAt < new Date()) {
            return res.status(400).json({ error: "That code has expired. Request a new one." });
        }

        // Count the attempt atomically before comparing so parallel guesses can't exceed the limit.
        const { attempts } = await prisma.pendingSignup.update({
            where: { email },
            data: { attempts: { increment: 1 } },
        });
        if (attempts > MAX_CODE_ATTEMPTS) {
            return res.status(429).json({ error: "Too many incorrect attempts. Request a new code." });
        }

        if (!codesMatch(pending.codeHash, hashCode(email, code))) {
            const attemptsLeft = Math.max(0, MAX_CODE_ATTEMPTS - attempts);
            return res.status(400).json({
                error: attemptsLeft > 0
                    ? `Incorrect code. ${attemptsLeft} ${attemptsLeft === 1 ? "attempt" : "attempts"} left.`
                    : "Too many incorrect attempts. Request a new code.",
                attemptsLeft,
            });
        }

        let newUser;
        try {
            [newUser] = await prisma.$transaction([
                prisma.user.create({
                    data: {
                        username: pending.username,
                        email: pending.email,
                        password: pending.password,
                        createdAt: new Date(),
                    },
                }),
                prisma.pendingSignup.delete({ where: { email } }),
            ]);
        } catch (error) {
            if (error.code === "P2002") {
                await prisma.pendingSignup.delete({ where: { email } }).catch(() => {});
                return res.status(409).json({ error: "That email or username was just taken. Please sign up again." });
            }
            throw error;
        }

        const token = generateToken(newUser.id, res);
        res.status(201).json({
            id: newUser.id,
            username: newUser.username,
            email: newUser.email,
            token,
            password: newUser.password,
            createdAt: newUser.createdAt
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error verifying email" });
    }
};

export async function resendCode(req, res) {
    try {
        if (!req.body.email) {
            return res.status(400).json({ error: "Email is required" });
        }
        const email = normalizeEmail(req.body.email);

        const pending = await prisma.pendingSignup.findUnique({ where: { email } });
        if (!pending) {
            return res.status(400).json({ error: "No pending signup for this email. Please sign up again." });
        }

        const wait = secondsUntilResend(pending);
        if (wait > 0) {
            return res.status(429).json({
                error: `Please wait ${wait}s before requesting another code`,
                retryAfterSeconds: wait,
            });
        }

        try {
            await issueCode(email, { username: pending.username, password: pending.password });
        } catch (error) {
            console.log("Error sending verification email:", error);
            return res.status(500).json({ error: "Couldn't send the verification email. Please try again." });
        }

        res.status(200).json(signupResponse(email));
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Error resending code" });
    }
};

export async function login(req,res) {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findFirst({
            where: { email: { equals: String(email ?? "").trim(), mode: "insensitive" } },
        });
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        
        const token = generateToken(existingUser.id, res);
        console.log("User logged in successfully");
        res.status(200).json({
            username: existingUser.username,
            email: existingUser.email,
            token,
            password: existingUser.password
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error logging in" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Error logging out" });
    }
};

export const checkAuth = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, username: true, email: true },
    });

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    res.status(200).json(user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error checking authentication" });
  }
};

export const updatePushToken = async (req, res) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({ error: "pushToken is required" });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { pushToken },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error updating push token" });
  }
};

//delete user