'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext } from '@hello-pangea/dnd';
import { useInstallPrompt } from '../../hooks/useInstallPrompt';
import ConnectionStatusIndicator from '../ConnectionStatusIndicator';
import NameList from '../NameList';
import EditNameModal from '../EditNameModal';
import initialNames from '../../constants/names';
import Calendar from './Calendar';

import logo from '/public/images/logo.png';

const CalendarPage = ({
  events,
  setEvents,
  isOnline,
  connectionStatus,
  onChangeEvent,
}) => {
  const { isPWAInstalled, promptInstall } = useInstallPrompt();
  const [names, setNames] = useState(initialNames);
  const [isDragging, setIsDragging] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentName, setCurrentName] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    setIsDragging(false);

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    if (
      source.droppableId.startsWith('calendarDay') &&
      destination.droppableId === 'nameList'
    ) {
      // Eliminar el evento al arrastrar desde calendarDay a nameList
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== result.draggableId)
      );
      if (typeof onChangeEvent === 'function') {
        onChangeEvent({
          type: 'DELETE_EVENT',
          payload: { id: result.draggableId },
        });
      }
      return;
    }

    if (
      source.droppableId === 'nameList' &&
      destination.droppableId.startsWith('calendarDay')
    ) {
      const draggedName = names.find((name) => name.id === result.draggableId);
      const newEvent = {
        id: uuidv4(),
        name: draggedName.name,
        date: destination.droppableId.replace('calendarDay', ''),
      };
      setEvents((prevEvents) => [...prevEvents, newEvent]);
      if (typeof onChangeEvent === 'function') {
        onChangeEvent({ type: 'ADD_EVENT', payload: newEvent });
      }
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === result.draggableId
            ? {
                ...event,
                date: destination.droppableId.replace('calendarDay', ''),
              }
            : event
        )
      );
      if (typeof onChangeEvent === 'function') {
        const draggedEvent = events.find(
          (event) => (event.id || event.customId) === result.draggableId
        );
        if (draggedEvent?.name) {
          onChangeEvent({
            type: 'UPDATE_EVENT',
            payload: {
              id: result.draggableId,
              name: draggedEvent.name,
              date: destination.droppableId.replace('calendarDay', ''),
            },
          });
        }
      }
    }
  };

  const openModal = (name) => {
    setCurrentName(name);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCurrentName(null);
  };

  const updateName = (updatedName) => {
    setNames((prevNames) =>
      prevNames.map((name) => (name.id === updatedName.id ? updatedName : name))
    );
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedName.id
          ? { ...event, name: updatedName.name }
          : event
      )
    );
    const findEvent = events.find((event) => event.id === updatedName.id);
    if (findEvent) {
      onChangeEvent({
        type: 'UPDATE_NAME_EVENT',
        payload: {
          id: updatedName.id,
          name: updatedName.name,
        },
      });
    }
    closeModal();
  };

  return (
    <>
      <div
        className={`header-logo bg-white flex items-center justify-between gap-3 border-b-2 ${ConnectionStatusIndicator(
          {
            connectionStatus,
          }
        )} h-20 p-4 shadow-custom-shadow mb-4 select-none transition-all`}
      >
        <Image
          src={logo}
          alt="Logo"
          className="w-auto h-auto max-h-full max-w-full pointer-events-none"
          priority={true}
        />
        {!isPWAInstalled && (
          <button
            id="pwa-install"
            className="install_app bg-blue-500 text-white text-sm rounded-md px-3 py-1.5 inline-flex w-auto"
            onClick={promptInstall}
          >
            Instalar aplicación
          </button>
        )}
      </div>
      <DragDropContext
        onDragStart={() => setIsDragging(true)}
        onDragEnd={onDragEnd}
      >
        <div className="flex flex-wrap justify-center gap-4 py-4 px-4">
          <Calendar
            events={events}
            isDragging={isDragging}
            openModal={openModal}
          />
          <NameList names={names} openModal={openModal} isOnline={isOnline} />
        </div>
        {isModalOpen && (
          <EditNameModal
            name={currentName}
            updateName={updateName}
            closeModal={closeModal}
          />
        )}
      </DragDropContext>
    </>
  );
};

export default CalendarPage;
