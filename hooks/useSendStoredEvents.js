import { useEffect } from 'react';
import sendStoredEvents from '../utils/sendStoredEvents';

const useSendStoredEvents = (isOnline, socket) => {
  useEffect(() => {
    if (isOnline && socket) {
      sendStoredEvents(socket);
    }
  }, [isOnline, socket]);
};

export default useSendStoredEvents;
