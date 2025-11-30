import jwt from "jsonwebtoken";
import Canvas from "../models/canvasModel.js";

const canvasData = {};

export const setupSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("joinCanvas", async ({ canvasId }) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return socket.emit("unauthorized", { message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const canvas = await Canvas.findById(canvasId);
        if (!canvas || (canvas.owner != userId && !canvas.shared.includes(userId))) {
          return socket.emit("unauthorized", { message: "Access denied" });
        }

        socket.join(canvasId);
        console.log(`User ${userId} joined canvas ${canvasId}`);
        socket.emit("loadCanvas", canvasData[canvasId] || canvas.elements);
      } catch (error) {
        console.error("Socket join error:", error);
        socket.emit("unauthorized", { message: "Invalid token" });
      }
    });

    socket.on("drawingUpdate", async ({ canvasId, elements }) => {
      try {
        canvasData[canvasId] = elements;
        socket.to(canvasId).emit("receiveDrawingUpdate", elements);
        await Canvas.findByIdAndUpdate(canvasId, { elements });
      } catch (err) {
        console.error("Drawing update error:", err);
      }
    });
  });
};
