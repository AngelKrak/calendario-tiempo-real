const { v4: uuidv4 } = require('uuid');
const Events = require('../models/Events');

const processEvents = async (events, updateDb = false) => {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  const existingIds = new Set();
  const processedEvents = [];

  for (const item of events) {
    let customId = item.customId;

    if (existingIds.has(customId)) {
      // Generar un nuevo customId único
      customId = uuidv4();

      // Si se debe actualizar en la base de datos y el customId es duplicado, hacerlo
      if (updateDb && existingIds.has(item.customId)) {
        try {
          // Encontrar el primer registro con el customId duplicado
          const existingEvent = await Events.findOne({
            where: { customId: item.customId },
          });

          if (existingEvent) {
            // Actualizar el customId del registro encontrado
            await Events.update(
              { customId: customId },
              { where: { eventId: existingEvent.eventId } } // Usar el ID único del registro
            );
            console.log(
              `Evento actualizado en la base de datos: ${item.customId} -> ${customId}`
            );
          } else {
            console.warn(
              `No se encontró evento con customId duplicado: ${item.customId}`
            );
          }
        } catch (error) {
          console.error('Error al actualizar evento:', error);
        }
      }
    }

    existingIds.add(customId);

    processedEvents.push({
      id: customId,
      name: item.name,
      date: item.date,
    });
  }

  return processedEvents;
};

module.exports = processEvents;
