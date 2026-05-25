import express from "express";
import cors from "cors";
import morgan from "morgan";
import { config } from "./config/env.js";
import { apiRouter } from "./routes/index.js";
import { notFoundHandler } from "./middleware/notFound.js";
import { errorHandler } from "./middleware/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: config.clientUrl,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  app.get("/api/health", (_req, res) => {
    res.status(200).json({
      success: true,
      message: "Ziya Construction API is running.",
      timestamp: new Date().toISOString(),
    });
  });

  app.use("/api", apiRouter);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};

