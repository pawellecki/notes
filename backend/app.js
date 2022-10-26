const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const app = express();
const io = require('socket.io')(app, {
  cors: {
    // origin: 'http://127.0.0.1:5173',
    origin: 'https://animated-cannoli-3bf6d7.netlify.app',
    methods: ['GET', 'POST'],
  },
});

const notesRoutes = require('./routes/notes-routes');
const usersRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-error');

app.use(bodyParser.json());

io.on('connection', (socket) => {
  socket.on('get-document', (noteId) => {
    socket.join(noteId);

    socket.on('send-changes', (delta) => {
      socket.broadcast.to(noteId).emit('receive-changes', delta);
    });
  });
});

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE'
  );

  next();
});

app.use('/api/notes', notesRoutes);
app.use('/api/users', usersRoutes);

app.use((req, res, next) => {
  throw new HttpError('Could not find this route :(', 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }

  res.status(error.code || 500);
  res.json({ message: error.message || 'Unknown error' });
});

const databaseConnectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.hqats.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

mongoose
  .connect(databaseConnectionString)
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
