require('dotenv').config();

const path = require('path');
const http = require('http');
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');
const { connectMongo } = require('./db/mongoose');
const initSocket = require('./socket');

require('./config/passport');

const app = express();

app.use(express.json());

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-in-production',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  },
});

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api', routes);

app.use(notFound);

app.use(errorHandler);

const HTTP_HOST = process.env.HTTP_HOST || '0.0.0.0';
const HTTP_PORT = Number(process.env.HTTP_PORT || process.env.PORT || 3000);

const server = http.createServer(app);

initSocket(server, sessionMiddleware);

const start = async () => {
  try {
    await connectMongo();
    server.listen(HTTP_PORT, HTTP_HOST, () => {
      console.log(`Server is running at http://${HTTP_HOST}:${HTTP_PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();

