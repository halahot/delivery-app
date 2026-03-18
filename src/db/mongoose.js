const mongoose = require('mongoose');

const MONGO_URL =
  process.env.MONGO_URL ||
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/delivery-app';

const connectMongo = async () => {
  if (!MONGO_URL) {
    throw new Error('MONGO_URL is not defined');
  }

  await mongoose.connect(MONGO_URL, {
    autoIndex: true,
  });
};

module.exports = {
  connectMongo,
};

