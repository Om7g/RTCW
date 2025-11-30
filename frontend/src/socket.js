import { io } from "socket.io-client";

// Don't autoConnect here; we'll connect with auth later
export const socket = io("http://localhost:8000", {
  autoConnect: false,
  transports: ["websocket"],
});
