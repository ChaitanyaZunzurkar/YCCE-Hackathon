import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";

import { connect } from "./config/db.js";
import { cloudinaryConnect } from "./config/cloudinary.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

// Database connect
connect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true,
  })
);

app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Cloudinary connection
cloudinaryConnect();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes); 

// Test route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running....",
  });
});

app.listen(PORT, () => {
  console.log(`App is running at ${PORT}`);
});
