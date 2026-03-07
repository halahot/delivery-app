const mongoose = require('mongoose');
const Message = require('./Message');

const { Schema } = mongoose;

const chatSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    messages: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Message',
      },
    ],
  },
  {
    timestamps: true,
  }
);

chatSchema.path('users').validate(function (value) {
  return Array.isArray(value) && value.length === 2;
}, 'Chat must have exactly two users');

chatSchema.statics.sendMessage = async function sendMessage(data) {
  const { author, receiver, text } = data || {};

  if (!author || !receiver || !text) {
    throw new Error('author, receiver and text are required');
  }

  let chat = await this.findOne({
    users: { $all: [author, receiver] },
  });

  if (!chat) {
    chat = await this.create({
      users: [author, receiver],
      messages: [],
    });
  }

  const message = await Message.create({
    chatId: chat._id,
    author,
    text,
    sentAt: new Date(),
  });

  chat.messages.push(message._id);
  await chat.save();

  return message;
};

chatSchema.statics.getHistory = async function getHistory(id) {
  if (!id) {
    throw new Error('chat id is required');
  }

  const messages = await Message.find({ chatId: id })
    .sort({ createdAt: 1 })
    .exec();

  return messages;
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

