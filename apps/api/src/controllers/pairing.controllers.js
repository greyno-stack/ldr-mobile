import prisma from "../config/prisma.js"; // adjust to wherever your Prisma client is set up
import crypto from "crypto";

// GET /pairing/status
export const getPairingStatus = async (req, res) => {
  try {
    const userId = req.user.id; // from protectRoute middleware

    const couple = await prisma.couple.findFirst({
      where: {
        status: "ACTIVE",
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: { user1: true, user2: true },
    });

    if (!couple) {
      return res.status(200).json({ paired: false, partner: null });
    }

    const partner = couple.user1Id === userId ? couple.user2 : couple.user1;

    res.status(200).json({
      paired: true,
      partner: { id: partner.id, username: partner.username, email: partner.email },
      since: couple.createdAt,
    });
  } catch (error) {
    console.error("Error getting pairing status:", error);
    res.status(500).json({ error: "Failed to get pairing status" });
  }
};

// GET /pairing/invite
export const getOrCreateInvite = async (req, res) => {
  try {
    const userId = req.user.id;

    // if user already has an active invite, just return it
    let invite = await prisma.pairingInvite.findUnique({
      where: { ownerId: userId },
    });

    if (!invite) {
      const code = crypto.randomBytes(4).toString("hex").toUpperCase(); // e.g. "A1B2C3D4"
      invite = await prisma.pairingInvite.create({
        data: { code, ownerId: userId },
      });
    }

    res.status(200).json({ code: invite.code });
  } catch (error) {
    console.error("Error creating invite:", error);
    res.status(500).json({ error: "Failed to create invite" });
  }
};

// POST /pairing/join
export const joinWithCode = async (req, res) => {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: "Invite code is required" });
    }

    const invite = await prisma.pairingInvite.findUnique({
      where: { code },
    });

    if (!invite) {
      return res.status(404).json({ error: "Invalid invite code" });
    }

    if (invite.ownerId === userId) {
      return res.status(400).json({ error: "You can't pair with yourself" });
    }

    // check neither user is already actively paired
    const existingCouple = await prisma.couple.findFirst({
      where: {
        status: "ACTIVE",
        OR: [
          { user1Id: userId }, { user2Id: userId },
          { user1Id: invite.ownerId }, { user2Id: invite.ownerId },
        ],
      },
    });

    if (existingCouple) {
      return res.status(409).json({ error: "One of you is already paired" });
    }

    const couple = await prisma.couple.create({
      data: { user1Id: invite.ownerId, user2Id: userId },
    });

    await prisma.pairingInvite.delete({ where: { code } });

    res.status(201).json({ paired: true, coupleId: couple.id });
  } catch (error) {
    console.error("Error joining with code:", error);
    res.status(500).json({ error: "Failed to join with code" });
  }
};