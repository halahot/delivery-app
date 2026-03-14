const { Server } = require('socket.io');
const passport = require('passport');
const registerChatHandlers = require('./chatHandlers');

function initSocket(server, sessionMiddleware) {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket, next) => {
    sessionMiddleware(socket.request, {}, next);
  });

  io.use((socket, next) => {
    passport.initialize()(socket.request, {}, (err) => {
      if (err) return next(err);
      passport.session()(socket.request, {}, next);
    });
  });

  io.use((socket, next) => {
    const req = socket.request;
    if (!req.user || !req.user._id) {
      return next(new Error('Unauthorized'));
    }
    next();
  });

  io.on('connection', (socket) => {
    const user = socket.request.user;
    const userId = String(user._id);

    socket.join(userId);

    registerChatHandlers(io, socket, userId);
  });

  return io;
}

module.exports = initSocket;

