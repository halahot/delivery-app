const mongoose = require('mongoose');
const { EventEmitter } = require('events');
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

const chatEvents = new EventEmitter();

chatSchema.statics.find = async function find(users) {
  if (!Array.isArray(users) || users.length !== 2) {
    throw new Error('users must be an array of two user ids');
  }

  const [firstUser, secondUser] = users;
  if (!firstUser || !secondUser) {
    throw new Error('users must be an array of two user ids');
  }

  const chat = await this.findOne({
    users: { $all: [firstUser, secondUser] },
  }).exec();

  return chat;
};

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

  chatEvents.emit('message', {
    chatId: chat._id,
    message,
  });

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

chatSchema.statics.subscribe = function subscribe(callback) {
  if (typeof callback !== 'function') {
    throw new Error('callback is required');
  }

  chatEvents.on('message', callback);

  return () => {
    chatEvents.off('message', callback);
  };
};

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
