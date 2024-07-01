import React from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';
import Image from 'next/image';

import editIcon from '/public/icons/edit-icon.svg';

const NameList = ({ isOnline, names, openModal }) => {
  return (
    <Droppable droppableId="nameList">
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="bg-white shadow-custom-shadow p-4 rounded-sm w-full flex flex-col gap-2 flex-1 sm:flex-[0.4] min-w-[220px]"
        >
          <div className="mb-4">
            <h2 className="flex items-center text-licorice text-2xl font-bold mb-1">
              <span className="mr-2">Participantes</span>
              <span
                className={`${
                  isOnline
                    ? 'is-online bg-green-500 animate-pulse-online'
                    : 'is-offline bg-gray-400 animate-pulse-offline'
                } inline h-2 w-2 rounded-full`}
              />
            </h2>
            <p className="text-sm text-gray-800">
              Arrastra y suelta un nombre sobre el calendario para asignarle una
              fecha específica.
            </p>
          </div>
          <div className="flex items-start flex-row flex-wrap sm:flex-col gap-2 select-none">
            {names.map((name, index) => (
              <Draggable key={name.id} draggableId={name.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className={`bg-blue-500 text-white rounded-md px-2 py-1.5 inline-flex justify-between items-center w-auto ${
                      snapshot.isDragging ? 'opacity-50' : ''
                    }`}
                  >
                    <span className="ml-1 text-[14.777px]">{name.name}</span>
                    {!snapshot.isDragging && (
                      <button
                        onClick={() => openModal(name)}
                        className="ml-2 px-2 py-1.5 text-blue-500"
                      >
                        <Image
                          src={editIcon}
                          alt="Logo"
                          width={16}
                          height={16}
                          className="w-[16px] h-[16px] pointer-events-none"
                          priority={true}
                        />
                      </button>
                    )}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  );
};

export default NameList;
