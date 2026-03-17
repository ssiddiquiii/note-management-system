import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { pinoHttp } from "pino-http";
import logger from "./utils/logger.js";
import { errorHandler } from "./middlewares/error.middleware.js"; 

const app = express();

// 1. CORS Configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    credentials: true,
  })
);

// 2. Attach Logger Middleware (MUST be near the top)
// This logs every request: "GET /api/v1/users/register 200 OK"
app.use(
  pinoHttp({
    logger,
    autoLogging: process.env.NODE_ENV !== "test",
    customLogLevel: function (req, res, err) {
      if (res.statusCode >= 400 && res.statusCode < 500) return "warn";
      if (res.statusCode >= 500 || err) return "error";
      return "info";
    },
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

// 3. Import Routes
import userRouter from "./routes/user.route.js";
import noteRouter from "./routes/note.route.js";

// 4. Route Declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);

// 5. Global Error Handler (MUST be the LAST middleware)
app.use(errorHandler);

export { app };