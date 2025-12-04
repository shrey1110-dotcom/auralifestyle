import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_BASE_REPLACE_WITH_BACKEND_OR_EMPTY ?? "/", {
  // default connect to same origin — set explicitly in dev
  autoConnect: false,
});

export default socket;
