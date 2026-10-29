import prisma from "../config/prisma.js";

const getActiveCouple = async (userId) => {
  return prisma.couple.findFirst({
    where: {
      status: "ACTIVE",
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
  });
};

const sendExpoPushNotification = async (pushToken, { title, body, data }) => {
  if (!pushToken) return;

  try {
    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ to: pushToken, title, body, data, sound: "default" }),
    });
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
};

// POST /notes
export const sendNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Note text is required" });
    }

    const couple = await getActiveCouple(userId);
    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    const partnerId = couple.user1Id === userId ? couple.user2Id : couple.user1Id;

    const note = await prisma.note.create({
      data: {
        coupleId: couple.id,
        senderId: userId,
        text: text.trim(),
      },
    });

    const [sender, partner] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId }, select: { username: true } }),
      prisma.user.findUnique({ where: { id: partnerId }, select: { pushToken: true } }),
    ]);

    sendExpoPushNotification(partner?.pushToken, {
      title: `A note from ${sender?.username ?? "your partner"}`,
      body: note.text,
      data: { type: "note", noteId: note.id },
    });

    res.status(201).json({ note });
  } catch (error) {
    console.error("Error sending note:", error);
    res.status(500).json({ error: "Failed to send note" });
  }
};

// GET /notes
export const getNotes = async (req, res) => {
  try {
    const userId = req.user.id;

    const couple = await getActiveCouple(userId);
    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    const notes = await prisma.note.findMany({
      where: { coupleId: couple.id, senderId: { not: userId }, dismissedAt: null },
      orderBy: { createdAt: "desc" },
      include: { sender: { select: { username: true } } },
    });

    res.status(200).json({ notes });
  } catch (error) {
    console.error("Error getting notes:", error);
    res.status(500).json({ error: "Failed to get notes" });
  }
};

// PATCH /notes/:id/dismiss
export const dismissNote = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const couple = await getActiveCouple(userId);
    if (!couple) {
      return res.status(404).json({ error: "You're not paired yet" });
    }

    const note = await prisma.note.findUnique({ where: { id } });
    if (!note || note.coupleId !== couple.id) {
      return res.status(404).json({ error: "Note not found" });
    }

    await prisma.note.update({
      where: { id },
      data: { dismissedAt: new Date() },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error dismissing note:", error);
    res.status(500).json({ error: "Failed to dismiss note" });
  }
};
