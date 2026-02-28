const mongoose = require('mongoose');

const { Schema } = mongoose;

const advertisementSchema = new Schema(
  {
    shortText: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    images: [
      {
        type: String,
        trim: true,
      },
    ],
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    isDeleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);


const Advertisement = mongoose.model('Advertisement', advertisementSchema);

module.exports = Advertisement;

