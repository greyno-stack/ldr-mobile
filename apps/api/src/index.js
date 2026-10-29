import express from "express";
import { createServer } from "http";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes.js";
import pairingRoutes from "./routes/pairing.routes.js";
import countdownRoutes from "./routes/countdown.routes.js";
import noteRoutes from "./routes/note.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import prisma from "./config/prisma.js";
import { initPresence } from "./lib/presence.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true,
    credentials: true,
}));


// API routes
app.use("/api/auth", authRoutes);
app.use("/api/pairing", pairingRoutes);
app.use("/api/countdown", countdownRoutes);
app.use("/api/notes", noteRoutes);

const httpServer = createServer(app);
initPresence(httpServer);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});