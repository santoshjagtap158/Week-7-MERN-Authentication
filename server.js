const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

require("dotenv").config();

const { notFound, errorHandler } =
  require("./middleware/errorHandler");

const app = express();

// JSON Parser
app.use(express.json());

// CORS
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"]
  })
);

// Helmet Security
app.use(helmet());

// Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 200,
  message: {
    message: "Too many requests. Please try later."
  }
});

app.use("/api", limiter);

// Routes
app.use("/api", require("./routes/authRoutes"));
app.use("/api", require("./routes/userRoutes"));

// Error Handling
app.use(notFound);
app.use(errorHandler);

// Server and Database Connection
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("DB Connected");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();