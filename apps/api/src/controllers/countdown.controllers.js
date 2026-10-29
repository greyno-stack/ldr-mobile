import prisma from "../config/prisma.js"; 

// Helper: find the caller's active couple
const getActiveCouple = async (userId) => {
  return prisma.couple.findFirst({
    where: {
      status: "ACTIVE",
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: { countdown: true },
  });
};

// GET /countdown
export const getCountdown = async (req, res) => {
  try {
    const userId = req.user.id;

    const couple = await getActiveCouple(userId);

    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    res.status(200).json({ countdown: couple.countdown ?? null });
  } catch (error) {
    console.error("Error getting countdown:", error);
    res.status(500).json({ error: "Failed to get countdown" });
  }
};

// POST /countdown
export const createCountdown = async (req, res) => {
  try {
    const userId = req.user.id;
    const { targetDate, title } = req.body;

    if (!targetDate) {
      return res.status(400).json({ error: "targetDate is required" });
    }

    const parsedDate = new Date(targetDate);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ error: "targetDate is invalid" });
    }

    if (parsedDate <= new Date()) {
      return res.status(400).json({ error: "targetDate must be in the future" });
    }

    const couple = await getActiveCouple(userId);

    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    if (couple.countdown) {
      return res.status(409).json({ error: "A countdown already exists" });
    }

    const countdown = await prisma.countdown.create({
      data: {
        coupleId: couple.id,
        targetDate: parsedDate,
        title: title ?? null,
        createdBy: String(userId),
      },
    });

    res.status(201).json({ countdown });
  } catch (error) {
    console.error("Error creating countdown:", error);
    res.status(500).json({ error: "Failed to create countdown" });
  }
};

// DELETE /countdown
export const deleteCountdown = async (req, res) => {
  try {
    const userId = req.user.id;

    const couple = await getActiveCouple(userId);

    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    if (!couple.countdown) {
      return res.status(404).json({ error: "No countdown to delete" });
    }

    await prisma.countdown.delete({ where: { coupleId: couple.id } });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error deleting countdown:", error);
    res.status(500).json({ error: "Failed to delete countdown" });
  }
};