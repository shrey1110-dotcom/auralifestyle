let io = null;

/**
 * attachSocket(io)
 * - Call this once from server startup after creating the socket.io server.
 * - Attaches generic listeners and makes `getIo()` return the instance.
 */
export function attachSocket(serverIo) {
  if (!serverIo) return;
  io = serverIo;

  // optional: namespace / room handling
  io.on('connection', (socket) => {
    console.log('[socket] connected', socket.id);

    // dev helper: clients can request to join admin room
    socket.on('join:admin', (payload) => {
      try {
        socket.join('admin');
        socket.emit('joined:admin', { ok: true });
      } catch (e) { /* ignore */ }
    });

    socket.on('disconnect', (reason) => {
      // keep logs small
      // console.log('[socket] disconnected', socket.id, reason);
    });
  });
}

/**
 * getIo()
 * - returns the socket.io instance (if attached)
 */
export function getIo() {
  if (!io) throw new Error('Socket.io not attached yet — call attachSocket(io) first');
  return io;
}

/**
 * safeEmit(room, event, payload)
 * - convenience wrapper (no throw if io missing)
 */
export function safeEmit(roomOrEvent, eventOrPayload, maybePayload) {
  try {
    if (!io) return;
    if (maybePayload === undefined) {
      // signature safeEmit(event, payload) => emit to all
      io.emit(roomOrEvent, eventOrPayload);
    } else {
      // signature safeEmit(room, event, payload)
      io.to(roomOrEvent).emit(eventOrPayload, maybePayload);
    }
  } catch (e) {
    // ignore emit errors in backend helper
  }
}
