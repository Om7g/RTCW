import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import jwt from "jsonwebtoken";
import { Server as SocketIOServer } from "socket.io";

import connectToDatabase from "./db/index.js";
import userRoutes from "./routes/userRoutes.js";
import canvasRoutes from "./routes/canvasRoutes.js";
import Canvas from "./models/canvasModel.js";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Connect to DB
connectToDatabase();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/canvas", canvasRoutes);

// Simple test route
app.post("/test", (req, res) => {
  console.log("Listening post req");
  res.sendStatus(200);
});

// HTTP & Socket Server Setup
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"]
  }
});

// Socket logic
let canvasData = {};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("joinCanvas", async ({ canvasId }) => {
    console.log("Joining canvas:", canvasId);
    try {
      const token = socket.handshake.auth.token;
        if (!token) {
          socket.emit("unauthorized", { message: "Access Denied: No Token" });
          return;
        }

      const decoded = jwt.verify(token, SECRET_KEY);
      const userId = decoded.id;
      console.log("User ID:", userId);

      const canvas = await Canvas.findById(canvasId);
      if (!canvas || (String(canvas.owner) !== String(userId) && !canvas.shared.includes(userId))) {
        console.log("Unauthorized access.");
        setTimeout(() => {
          socket.emit("unauthorized", { message: "You are not authorized to join this canvas." });
        }, 100);
        return;
      }

      socket.join(canvasId);
      console.log(`User ${socket.id} joined canvas ${canvasId}`);

      if (canvasData[canvasId]) {
        socket.emit("loadCanvas", canvasData[canvasId]);
      } else {
        socket.emit("loadCanvas", canvas.elements);
      }
    } catch (error) {
      console.error(error);
      socket.emit("error", { message: "An error occurred while joining the canvas." });
    }
  });

  socket.on("drawingUpdate", async ({ canvasId, elements }) => {
    try {
      canvasData[canvasId] = elements;
      socket.to(canvasId).emit("receiveDrawingUpdate", elements);

      const canvas = await Canvas.findById(canvasId);
      if (canvas) {
        await Canvas.findByIdAndUpdate(canvasId, { elements }, { new: true });
      }
    } catch (error) {
      console.error("drawingUpdate error:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});


  const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port : ${PORT}`);
});
