import express, { urlencoded, json } from "express";
import { static as expressStatic } from "express";
import { join } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import AuthRoute from "./routes/AuthRoute.js";
import DepartmentRoute from "./routes/DepartmentRoute.js";
import StudentRoute from "./routes/StudentRoute.js";
import StaffRoute from "./routes/StaffRoute.js";
import ClearanceRoute from "./routes/ClearanceRoute.js";
import ApprovalRoute from "./routes/ApprovalRoute.js";
import ErrorResponse from "./utils/errorResponse.js";
import { errorHandler } from "./middlewares/error.js";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import compression from "compression";

// For __dirname in ESM
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3000;

const app = express();
app.set("trust proxy", 1); // Trust the first proxy

const allowedOrigins = ["http://localhost:3000", "http://localhost:5173", "http://localhost:3039"];
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Enable if your app requires cookies
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Performance middleware
app.use(helmet());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
});
app.use(limiter);

app.use(logger("dev"));
app.use(urlencoded({ extended: true }));
app.use(json({ limit: "10mb" })); // Increase JSON payload size limit
app.use(cookieParser());
app.use(expressStatic(join(__dirname, "public")));

// Optional logging middleware to verify headers
app.use((req, res, next) => {
  res.on("finish", () => {
    console.log(`Request Origin: ${req.headers.origin}`);
    console.log("Access-Control-Allow-Origin:", res.get("Access-Control-Allow-Origin"));
  });
  next();
});

// Routes connection
app.use("/api/auth", AuthRoute);
app.use("/api/department", DepartmentRoute);
app.use("/api/student", StudentRoute); 
app.use("/api/staff", StaffRoute); 
app.use("/api/clearance", ClearanceRoute); 
app.use("/api/approval", ApprovalRoute); 


// Catch 404 and forward to error handler
app.use((req, res, next) => {
  next(new ErrorResponse("Resource not found", 404));
});

// Global error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on("unhandledRejection", (err, promise) => {
  console.log(`Logged Error: ${err.message}`);
  server.close(() => process.exit(1));
});
