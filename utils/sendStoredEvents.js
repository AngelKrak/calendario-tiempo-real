import { toast } from 'react-toastify';
import toastConfig from '../config/toast.config';

const sendStoredEvents = (socket) => {
  const offlineEvents = JSON.parse(localStorage.getItem('offlineEvents')) || [];

  if (!socket || offlineEvents.length === 0) {
    return; // No hay eventos que enviar o el socket no está disponible
  }

  const successfullySentEvents = [];

  const emitEvent = (eventName, emitPayload) => {
    return new Promise((resolve, reject) => {
      socket.emit(eventName, emitPayload, (response) => {
        if (response.status === 'ok') {
          successfullySentEvents.push(event);
          resolve();
        } else {
          console.error(`Failed to send ${eventName} event:`, event);
          reject(response.error || 'Unknown error');
        }
      });
    });
  };

  const emitEvents = async () => {
    for (const event of offlineEvents) {
      const { type, payload } = event;
      let eventName, emitPayload;

      switch (type) {
        case 'ADD_EVENT':
          eventName = 'event';
          emitPayload = payload;
          break;
        case 'UPDATE_EVENT':
          eventName = 'updateEventDate';
          emitPayload = payload;
          break;
        case 'UPDATE_NAME_EVENT':
          eventName = 'updateEventName';
          emitPayload = payload;
          break;
        case 'DELETE_EVENT':
          eventName = 'deleteEvent';
          emitPayload = payload?.id;
          break;
        default:
          console.error('Invalid event type:', type);
          continue; // Skip processing invalid event types
      }

      try {
        await emitEvent(eventName, emitPayload);
      } catch (error) {
        console.error('Error sending event:', error);
        throw error; // Propagate the error up if needed
      }
    }
  };

  emitEvents()
    .then(() => {
      // All events sent successfully
      const successMessage =
        'Todos los cambios pendientes se han enviado y actualizado correctamente.';
      toast(successMessage, { ...toastConfig, toastId: 'send-local' });
      localStorage.removeItem('offlineEvents');
    })
    .catch((error) => {
      // Error handling
      const errorMessage =
        'No se pudieron enviar todos los cambios pendientes. Por favor, intenta nuevamente más tarde.';
      toast(errorMessage, { ...toastConfig, toastId: 'send-error-local' });
      console.error('Error sending stored events:', error);
    });
};

export default sendStoredEvents;
