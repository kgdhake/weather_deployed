import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import weatherRoutes from "./routes/weather.js";

dotenv.config();

const app = express();

// Disable x-powered-by header
app.disable("x-powered-by");

// Security HTTP headers
app.use(helmet());

// Restrict CORS origins
const allowedOrigins = process.env.FRONTEND_URL
  ? process.env.FRONTEND_URL.split(",").map(url => url.trim())
  : ["http://localhost:5173", "http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl) or if origin is in whitelist
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by CORS policy"));
    }
  },
  methods: ["GET"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Body parser with size limits
app.use(express.json({ limit: "10kb" }));

// Rate limiter for API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 120, // max 120 requests per 15 minutes per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests from this IP, please try again later." }
});
app.use("/api/", apiLimiter);

// Routes
app.use("/api/weather", weatherRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Server Error:", err.message);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running securely on port ${PORT}`);
});

