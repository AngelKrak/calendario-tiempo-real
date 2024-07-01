'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import weekday from 'dayjs/plugin/weekday';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import 'dayjs/locale/es';

dayjs.extend(isoWeek);
dayjs.extend(weekday);

dayjs.locale('es');

const Calendar = ({ events, isDragging, openModal }) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();
  const todayDayIndex = dayjs().day();

  const renderCalendar = (month) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');

    const startDate = startOfMonth.startOf('isoWeek'); // Inicio de la primera semana completa del mes
    const endDate = endOfMonth.endOf('isoWeek'); // Fin de la última semana completa del mes

    const dayFormat = 'D';
    const weeks = [];

    let currentDay = startDate.clone();

    while (currentDay.isBefore(endDate)) {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(currentDay.clone());
        currentDay = currentDay.add(1, 'day');
      }
      weeks.push(week);
    }

    return weeks.map((week, weekIndex) => (
      <tr key={weekIndex}>
        {week.map((day, dayIndex) => {
          const isCurrentMonth = day.month() === month.month();
          const eventsFilter = (Array.isArray(events) ? events : []).filter(
            (event) => event.date === day.format('YYYY-MM-DD')
          );

          return (
            <td
              key={day.format('YYYY-MM-DD')}
              className={`text-center align-top ${
                dayIndex !== 6 ? 'border-r border-gray-200' : 'border-gray-200'
              } ${weekIndex !== weeks.length - 1 ? 'border-b' : ''} ${
                dayIndex !== 0 ? 'border-l' : ''
              } ${
                weekIndex === weeks.length - 1 && dayIndex === 6
                  ? 'border-b-0'
                  : ''
              } ${
                !isCurrentMonth ? 'text-gray-400' : '' // Estilo para días fuera del mes actual
              }`}
            >
              <div
                className={`pt-4 px-4 text-lg text-left ${
                  day.isSame(today, 'day') ? 'text-blue-500 font-bold' : ''
                }`}
              >
                {day.format(dayFormat)}
              </div>
              {isCurrentMonth && (
                <Droppable
                  droppableId={`calendarDay${day.format('YYYY-MM-DD')}`}
                >
                  {(provided) => (
                    <div className="mt-2 text-sm select-none">
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`pt-1 p-4 flex flex-col min-h-[2em] min-w-[6rem] h-full w-full`}
                        onDragOver={(e) => e.preventDefault()}
                      >
                        {eventsFilter.map((event, index) => (
                          <Draggable
                            key={event.id || event.customId || event.eventId}
                            draggableId={
                              event.id || event.customId || event.eventId
                            }
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-blue-500 text-white rounded-md px-2 py-1.5 mt-1 inline w-auto`}
                                style={{ ...provided.draggableProps.style }}
                                onClick={() => openModal(event)}
                              >
                                {event.name}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    </div>
                  )}
                </Droppable>
              )}
            </td>
          );
        })}
      </tr>
    ));
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const dayNames = [
    { full: 'Lunes', short: 'L', medium: 'Lun' },
    { full: 'Martes', short: 'M', medium: 'Mar' },
    { full: 'Miércoles', short: 'X', medium: 'Mié' },
    { full: 'Jueves', short: 'J', medium: 'Jue' },
    { full: 'Viernes', short: 'V', medium: 'Vie' },
    { full: 'Sábado', short: 'S', medium: 'Sáb' },
    { full: 'Domingo', short: 'D', medium: 'Dom' },
  ];

  return (
    <div
      className={`bg-white shadow-custom-shadow px-2 py-4 rounded-sm flex flex-col w-full min-w-[320px] flex-1 ${
        isDragging ? 'overflow-hidden' : 'overflow-auto'
      }`}
    >
      <div className="flex justify-between items-center mb-4 w-full">
        <button onClick={handlePrevMonth} className="p-2 text-2xl">
          <Image
            alt="Anterior"
            src="/icons/prev-icon.svg"
            height={20}
            width={20}
          />
        </button>
        <h2 className="text-xl text-licorice font-bold capitalize">
          {currentMonth.format('MMMM YYYY')}
        </h2>
        <button onClick={handleNextMonth} className="p-2 text-2xl">
          <Image
            alt="Siguiente"
            src="/icons/next-icon.svg"
            height={20}
            width={20}
          />
        </button>
      </div>
      <div className={`h-full ${isDragging ? 'isDragging' : 'not-isDragging'}`}>
        <table className="h-full w-full table-auto">
          <thead className="bg-white">
            <tr>
              {dayNames.map((day, index) => (
                <th
                  key={index}
                  className={`${
                    index !== 0 ? 'border-l' : ''
                  } p-4 border-b-2 border-gray-200 ${
                    index + 1 === todayDayIndex
                      ? 'border-b-2 border-b-blue-500'
                      : ''
                  }`}
                >
                  <span className="block sm:hidden">{day.short}</span>
                  <span className="hidden sm:block lg:hidden">
                    {day.medium}
                  </span>
                  <span className="hidden lg:block">{day.full}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar(currentMonth)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Calendar;
