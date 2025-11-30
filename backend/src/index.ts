import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import apiRouter from "./routes/api";
import prisma from "./lib/prisma";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to MongoDB via Prisma");
    app.use("/api", apiRouter);
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server is running at http://localhost:${PORT}`);
    });
    const shutdown = async () => {
      console.log("\n🛑 Shutting down server...");
      server.close(() => {
        console.log("Server closed");
      });
      await prisma.$disconnect();
      console.log("Database disconnected");
      process.exit(0);
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

  } catch (error: any) {
    console.error("❌ Failed to start server:", error?.message || error);
    process.exit(1);
  }
}

startServer();
