'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { ToastContainer, Slide } from 'react-toastify';
import CalendarPage from '../components/Calendar/index';
import useEventHandling from '../hooks/useEventHandling';

const Home = () => {
  const [socket, setSocket] = useState(null);
  const [events, setEvents] = useState([]);
  const [connectionStatus, setConnectionStatus] = useState('Conectando');
  const { isOnline, onChangeEvent } = useEventHandling(socket);

  useEffect(() => {
    const socket = io('/', {
      path: '/api/socket',
      transports: ['polling', 'websocket'],
    });

    socket.on('connect', () => {
      setSocket(socket);
      setConnectionStatus('Conectado');
    });

    socket.on('disconnect', () => {
      setSocket(null);
      setConnectionStatus('Desconectado');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('Error al conectar');
    });

    socket.on('loadEvents', (data) => {
      setEvents(data);
    });

    socket.on('event', (item) => {
      setEvents((prevEvents) => {
        const updatedEvents = Array.isArray(prevEvents) ? prevEvents : [];

        return [...updatedEvents, item];
      });
    });

    socket.on('updateEventDate', (updatedEvent) => {
      setEvents((prevEvents) => {
        const updatedEvents = Array.isArray(prevEvents) ? prevEvents : [];

        return updatedEvents.map((event) =>
          event.id === updatedEvent.id
            ? { ...event, date: updatedEvent.date }
            : event
        );
      });
    });

    socket.on('updateEventName', (updatedEvent) => {
      setEvents((prevEvents) => {
        const updatedEvents = Array.isArray(prevEvents) ? prevEvents : [];

        return updatedEvents.map((event) =>
          event.id === updatedEvent.id
            ? { ...event, name: updatedEvent.name }
            : event
        );
      });
    });

    socket.on('deleteEvent', (deletedEventId) => {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== deletedEventId)
      );
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Slide}
        stacked={false}
      />
      <CalendarPage
        events={events}
        setEvents={setEvents}
        isOnline={isOnline}
        connectionStatus={connectionStatus}
        onChangeEvent={onChangeEvent}
      />
    </>
  );
};

Home.getInitialProps = async (appContext) => {
  try {
    await fetch('/api/socket');

    let pageProps = {};
    if (Home.getInitialProps) {
      pageProps = await Home.getInitialProps(appContext);
    }

    return { pageProps, apiData };
  } catch (error) {
    console.error('Error fetching data:', error);
    return { pageProps: {} };
  }
};

export default Home;
