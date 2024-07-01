const express = require('express');
const next = require('next');
const { Server } = require('socket.io');
const http = require('http');
const sequelize = require('./config/database');
const Events = require('./models/Events');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    // transports: ['websocket', 'polling'],
  });

  server.use(express.json());

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const initializeSocket = async () => {
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    await sequelize.sync();
    console.log('Database connected successfully');

    io.on('connection', async (socket) => {
      console.log('New client connected');

      const events = await Events.findAll({ order: [['eventId', 'ASC']] });
      socket.emit('loadEvents', events);

      socket.on('event', async (data, callback) => {
        console.log('event received:', data);

        try {
          const event = await Events.create({
            customId: data.customId,
            name: data.name,
            date: data.date,
          });

          io.emit('event', event);

          if (callback) callback({ status: 'ok' });
        } catch (error) {
          console.error('Error saving event:', error);
          if (callback)
            callback({ status: 'error', error: 'Failed to save event' });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  };

  initializeSocket();

  const PORT = process.env.PORT || 3000;
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
