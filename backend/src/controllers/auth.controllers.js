import prisma from "../config/prisma.js";  
import bcrypt from "bcryptjs";

export async function signup(req,res) {
    const { username, email, password } = req.body;
    try {
        if(!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }
        if(password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await prisma.user.create({
            data: {
                username, 
                email,
                password: hashedPassword,
                createdAt: new Date()
            },
        });
        if(newUser) {
            generateToken(newUser.id, res);
            res.status(201).json({
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                password: newUser.password,
                createdAt: newUser.createdAt
            });
        }
        if(!newUser) {
            res.status(500).json({ error: "Error creating user" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating user" });
    }
};

export async function login(req,res) {
    try {
        const { email, password } = req.body;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }
        
        generateToken(existingUser.id, res);
        console.log("User logged in successfully");
        res.status(200).json({
            username: existingUser.username,
            email: existingUser.email,
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

export const checkAuth = (req, res) => {
  try {
    console.log(req.user);
    res.status(200).json(req.user);
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error checking authentication" });
  }
};

//delete user