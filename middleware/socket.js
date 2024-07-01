import { Server } from 'socket.io';
import sequelize from '../config/database';
import Events from '../models/Events';
import processEvents from '../utils/eventUtils';
import {
  handleDeleteEvent,
  handleEvent,
  handleUpdateEventDate,
  handleUpdateEventName,
} from '../controllers/eventHandlers';

let io;

const initializeSocket = async (req, res) => {
  if (!io) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }

    console.log('Initializing Socket.IO');

    io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      transports: ['polling', 'websocket'],
    });
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      console.log('New client connected');

      socket.conn.once('upgrade', () => {
        // called when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
        console.log('upgraded transport', socket.conn.transport.name); // prints "websocket"
      });

      // Enviar los eventos existentes al cliente al conectar
      const events = await Events.findAll({ raw: true, nest: true });
      const _events = await processEvents(events, true);
      socket.emit('loadEvents', _events);

      // Manejadores de eventos
      socket.on('event', (event, callback) =>
        handleEvent(event, socket, io, callback)
      );
      socket.on('updateEventDate', (event, callback) =>
        handleUpdateEventDate(event, io, callback)
      );
      socket.on('updateEventName', (event, callback) =>
        handleUpdateEventName(event, io, callback)
      );
      socket.on('deleteEvent', (deletedEventId, callback) =>
        handleDeleteEvent(deletedEventId, io, callback)
      );

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  return res;
};

export default initializeSocket;
