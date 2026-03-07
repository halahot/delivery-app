const mongoose = require('mongoose');

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

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;

