import { Server } from "socket.io";
import JWT from "jsonwebtoken";
import prisma from "../config/prisma.js";

// userId -> { sockets: Set<socketId>, active: boolean }
const presenceMap = new Map();

const statusFor = (entry) => {
  if (!entry || entry.sockets.size === 0) return "offline";
  return entry.active ? "online" : "away";
};

const resolvePartnerId = async (userId) => {
  try {
    const couple = await prisma.couple.findFirst({
      where: {
        status: "ACTIVE",
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
    });
    if (!couple) return null;
    return couple.user1Id === userId ? couple.user2Id : couple.user1Id;
  } catch (error) {
    console.error("Error resolving partner for presence:", error);
    return null;
  }
};

const notifyPartner = (io, partnerId, status) => {
  if (!partnerId) return;
  io.to(`user:${partnerId}`).emit("partner:status", { status });
};

export const initPresence = (httpServer) => {
  const io = new Server(httpServer, {
    cors: { origin: true, credentials: true },
  });

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Not authenticated"));

      const decoded = JWT.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.userID;
      next();
    } catch (error) {
      next(new Error("Not authenticated"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.userId;
    socket.join(`user:${userId}`);

    let entry = presenceMap.get(userId);
    const prevStatus = statusFor(entry);
    if (!entry) {
      entry = { sockets: new Set(), active: true };
      presenceMap.set(userId, entry);
    }
    entry.sockets.add(socket.id);

    // Cache the lookup so every handler below awaits the same in-flight
    // promise instead of re-querying, and so no event emitted immediately
    // after connect is missed waiting for listeners to attach.
    socket.partnerIdPromise = resolvePartnerId(userId);
    socket.partnerIdPromise.then((partnerId) => {
      socket.partnerId = partnerId;
      const newStatus = statusFor(entry);
      if (newStatus !== prevStatus) {
        notifyPartner(io, partnerId, newStatus);
      }
    });

    socket.on("presence:get", async (_payload, ack) => {
      if (typeof ack !== "function") return;
      const partnerId = await socket.partnerIdPromise;
      if (!partnerId) return ack({ status: "offline" });
      ack({ status: statusFor(presenceMap.get(partnerId)) });
    });

    socket.on("presence:state", async ({ active } = {}) => {
      const current = presenceMap.get(userId);
      if (!current) return;

      const prev = statusFor(current);
      current.active = !!active;
      const next = statusFor(current);

      if (next !== prev) {
        const partnerId = await socket.partnerIdPromise;
        notifyPartner(io, partnerId, next);
      }
    });

    socket.on("disconnect", async () => {
      const current = presenceMap.get(userId);
      if (!current) return;

      const prev = statusFor(current);
      current.sockets.delete(socket.id);
      const next = statusFor(current);

      if (next !== prev) {
        const partnerId = await socket.partnerIdPromise;
        notifyPartner(io, partnerId, next);
      }

      if (current.sockets.size === 0) {
        presenceMap.delete(userId);
      }
    });
  });

  return io;
};
