const dayjs = require('dayjs');
const Events = require('../models/Events');

// Función para manejar la creación de un nuevo evento
const handleEvent = async (event, socket, io, callback) => {
  console.log('Event received:', event);

  try {
    // Guardar el evento en la base de datos
    const newEvent = await Events.create({
      customId: event.id,
      name: event.name,
      date: event.date,
    });

    // Emitir el evento a todos los clientes
    socket.broadcast.emit('event', { ...newEvent.toJSON(), id: event.id });

    if (callback) callback({ status: 'ok' }); // Enviar confirmación al cliente
  } catch (error) {
    console.error('Error saving event:', error);
    if (callback) callback({ status: 'error', error: 'Failed to save event' }); // Enviar error al cliente
  }
};

// Función para manejar la actualización de la fecha de un evento
const handleUpdateEventDate = async (event, io, callback) => {
  if (dayjs(event.date).isValid() === false) return;
  console.log('Event update received:', event);

  try {
    // Actualizar el evento en la base de datos
    const [numUpdated] = await Events.update(
      { date: event.date },
      { where: { customId: event.id } }
    );

    if (numUpdated === 0) {
      throw new Error('Event not found');
    }

    // Recuperar el evento actualizado después de la actualización
    const updatedEvent = await Events.findOne({
      where: { customId: event.id },
    });

    if (!updatedEvent) {
      throw new Error('Updated event not found in database');
    }

    // Emitir evento actualizado a todos los clientes
    io.emit('updateEventDate', { ...updatedEvent.toJSON(), id: event.id });

    if (callback) {
      callback({ status: 'ok' }); // Enviar confirmación al cliente
    }
  } catch (error) {
    console.error('Error updating event:', error);
    if (callback) {
      callback({ status: 'error', error: 'Failed to update event' }); // Enviar error al cliente
    }
  }
};

// Función para manejar la actualización de la fecha de un evento
const handleUpdateEventName = async (event, io, callback) => {
  console.log('Event update received:', event);

  try {
    // Actualizar el evento en la base de datos
    const [numUpdated] = await Events.update(
      { name: event.name },
      { where: { customId: event.id } }
    );

    if (numUpdated === 0) {
      throw new Error('Event not found');
    }

    // Recuperar el evento actualizado después de la actualización
    const updatedEvent = await Events.findOne({
      where: { customId: event.id },
    });

    if (!updatedEvent) {
      throw new Error('Updated event not found in database');
    }

    // Emitir evento actualizado a todos los clientes
    io.emit('updateEventName', { ...updatedEvent.toJSON(), id: event.id });

    if (callback) {
      callback({ status: 'ok' }); // Enviar confirmación al cliente
    }
  } catch (error) {
    console.error('Error updating event:', error);
    if (callback) {
      callback({ status: 'error', error: 'Failed to update event' }); // Enviar error al cliente
    }
  }
};

// Función para manejar la eliminación de un evento
const handleDeleteEvent = async (deletedEventId, io, callback) => {
  console.log('Event delete received:', deletedEventId);

  try {
    // Eliminar el evento de la base de datos
    const numDeleted = await Events.destroy({
      where: { customId: deletedEventId },
    });

    if (numDeleted === 0) {
      throw new Error('Event not found');
    }

    // Emitir evento de eliminación a todos los clientes
    io.emit('deleteEvent', deletedEventId);

    if (callback) {
      callback({ status: 'ok' }); // Enviar confirmación al cliente
    }
  } catch (error) {
    console.error('Error deleting event:', error);
    if (callback) {
      callback({ status: 'error', error: 'Failed to delete event' }); // Enviar error al cliente
    }
  }
};

module.exports = {
  handleEvent,
  handleUpdateEventDate,
  handleUpdateEventName,
  handleDeleteEvent,
};
