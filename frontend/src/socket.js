import { io } from "socket.io-client";

// Don't autoConnect here; we'll connect with auth later
export const socket = io(import.meta.env.VITE_BACKEND_URL, {
  autoConnect: false,
  transports: ["websocket"],
});
