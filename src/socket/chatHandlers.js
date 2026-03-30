const Chat = require('../models/Chat');

function registerChatHandlers(io, socket, userId) {
  socket.on('getHistory', async (payload) => {
    try {
      const { receiver } = payload || {};

      if (!receiver) {
        return socket.emit('chatHistory', []);
      }

      const receiverId = String(receiver);

      const chat = await Chat.find([userId, receiverId]);

      if (!chat) {
        return socket.emit('chatHistory', []);
      }

      const messages = await Chat.getHistory(chat._id);

      socket.emit('chatHistory', messages);
    } catch (err) {
      socket.emit('chatHistory', []);
    }
  });

  socket.on('sendMessage', async (payload) => {
    try {
      const { receiver, text } = payload || {};

      if (!receiver || !text) {
        return;
      }

      const receiverId = String(receiver);

      await Chat.sendMessage({
        author: userId,
        receiver: receiverId,
        text,
      });
    } catch (err) {}
  });

  const unsubscribe = Chat.subscribe(async ({ chatId, message }) => {
    try {
      const chat = await Chat.findById(chatId).select('users').lean();
      if (!chat || !Array.isArray(chat.users)) return;

      const users = chat.users.map((id) => String(id));
      if (!users.includes(String(userId))) return;

      const fullMessage = message.toObject ? message.toObject() : message;
      io.to(users).emit('newMessage', fullMessage);
    } catch (err) {}
  });

  socket.on('disconnect', () => {
    if (typeof unsubscribe === 'function') {
      unsubscribe();
    }
  });
}

module.exports = registerChatHandlers;
