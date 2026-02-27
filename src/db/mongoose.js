const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/delivery-app';

const connectMongo = async () => {
  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not defined');
  }

  await mongoose.connect(MONGODB_URI, {
    autoIndex: true,
  });
};

module.exports = {
  connectMongo,
};

