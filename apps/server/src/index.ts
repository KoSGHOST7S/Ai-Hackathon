import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

// Load root .env regardless of working directory
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

import authRouter from "./routes/auth";
import canvasRouter from "./routes/canvas";
import assignmentsRouter from "./routes/assignments";

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Request/response logger
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const { method, url } = req;

  // Log incoming request body (redact password)
  if (req.body && Object.keys(req.body).length > 0) {
    const safe = { ...req.body };
    if (safe.password) safe.password = "[REDACTED]";
    if (safe.canvasApiKey) safe.canvasApiKey = "[REDACTED]";
    console.log(`→ ${method} ${url}`, safe);
  } else {
    console.log(`→ ${method} ${url}`);
  }

  // Intercept res.json to log outgoing response
  const originalJson = res.json.bind(res);
  res.json = (body: unknown) => {
    const ms = Date.now() - start;
    console.log(`← ${method} ${url} ${res.statusCode} (${ms}ms)`, JSON.stringify(body).slice(0, 300));
    return originalJson(body);
  };

  next();
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRouter);
app.use("/canvas", canvasRouter);
app.use("/assignments", assignmentsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
