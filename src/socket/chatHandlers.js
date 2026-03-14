const Chat = require('../models/Chat');

function registerChatHandlers(io, socket, userId) {
  async function findChatBetweenUsers(currentUserId, receiverId) {
    const chat = await Chat.findOne({
      users: { $all: [currentUserId, receiverId] },
    }).exec();
    return chat;
  }

  socket.on('getHistory', async (payload) => {
    try {
      const { receiver } = payload || {};

      if (!receiver) {
        return socket.emit('chatHistory', []);
      }

      const receiverId = String(receiver);

      const chat = await findChatBetweenUsers(userId, receiverId);

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

      const message = await Chat.sendMessage({
        author: userId,
        receiver: receiverId,
        text,
      });

      const fullMessage = message.toObject ? message.toObject() : message;

      io.to(userId).to(receiverId).emit('newMessage', fullMessage);
    } catch (err) {}
  });
}

module.exports = registerChatHandlers;

