const mongoose = require('mongoose');

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    sentAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
  }
);

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;

