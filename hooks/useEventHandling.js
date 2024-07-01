import { useCallback } from 'react';
import { toast } from 'react-toastify';
import toastConfig from '../config/toast.config';
import useNetworkStatus from './useNetworkStatus';
import useSendStoredEvents from './useSendStoredEvents';
import handleOfflineEvent from '../utils/handleOfflineEvent';

const useEventHandling = (socket) => {
  const { isOnline } = useNetworkStatus();
  useSendStoredEvents(isOnline, socket);

  const onChangeEvent = useCallback(
    ({ type, payload }) => {
      if (isOnline && socket) {
        if (type === 'ADD_EVENT') socket.emit('event', payload);
        if (type === 'UPDATE_EVENT') socket.emit('updateEventDate', payload);
        if (type === 'UPDATE_NAME_EVENT')
          socket.emit('updateEventName', payload);
        if (type === 'DELETE_EVENT') socket.emit('deleteEvent', payload?.id);
      } else {
        toast(
          'Los cambios se almacenarán localmente y se cargarán una vez se restablezca la conexión.',
          { ...toastConfig, toastId: 'save-local' }
        );
        handleOfflineEvent({ type, payload });
      }
    },
    [isOnline, socket]
  );

  return { isOnline, onChangeEvent };
};

export default useEventHandling;
