"use client"
import React, { useState, useEffect } from 'react';
import { IoChevronBackOutline, IoChevronForwardOutline, IoAddOutline } from 'react-icons/io5';
import { EventModal } from './components/EventModal';
import { EventList } from './components/EventList';
import { CalendarEvent, EventStore } from '@/types';
import { getDaysInMonth, getFirstDayOfMonth, formatDate } from './utils/calendar';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

function App() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [events, setEvents] = useState<EventStore>({});
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | undefined>();

  useEffect(() => {
    const storedEvents = localStorage.getItem('calendarEvents');
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }, [events]);

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(undefined);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: selectedEvent?.id || crypto.randomUUID(),
    };

    setEvents((prev) => {
      const dateEvents = prev[eventData.date] || [];
      const updatedEvents = selectedEvent
        ? dateEvents.map((e) => (e.id === selectedEvent.id ? newEvent : e))
        : [...dateEvents, newEvent];

      return {
        ...prev,
        [eventData.date]: updatedEvents,
      };
    });
  };

  const handleDeleteEvent = () => {
    if (selectedEvent && selectedDate) {
      setEvents((prev) => ({
        ...prev,
        [formatDate(selectedDate)]: prev[formatDate(selectedDate)].filter(
          (e) => e.id !== selectedEvent.id
        ),
      }));
      setIsModalOpen(false);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setSelectedDate(new Date(event.date));
    setIsModalOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );
    const firstDayOfMonth = getFirstDayOfMonth(
      currentDate.getFullYear(),
      currentDate.getMonth()
    );

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="h-24" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        day
      );
      const dateStr = formatDate(date);
      const dayEvents = events[dateStr] || [];
      let istoday = false;
      const today = new Date();
      if(today.getDate() === date.getDate() && today.getMonth()===date.getMonth() && today.getFullYear()===date.getFullYear()){

        istoday = true;
      }
      
      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-gray-50 ${istoday ? 'bg-blue-100 hover:bg-blue-200' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          <div className="flex justify-between items-center">
            <span className={`text-sm ${
              dayEvents.length > 0 ? 'font-semibold text-black' : 'text-black'
            }`}>
              {day} 
            </span>
            <button
              className="p-1 hover:bg-gray-200 rounded-full"
              onClick={(e) => {
                e.stopPropagation();
                handleDateClick(date);
              }}
            >
              <IoAddOutline size={16} />
            </button>
          </div>
          <div className="mt-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className="text-xs p-1 mb-1 bg-pink-100 rounded truncate"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditEvent(event);
                }}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-gray-100 text-black rounded-full"
              >
                <IoChevronBackOutline size={24} />
              </button>
              <h2 className="text-xl w-40 text-black font-semibold">
                {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 text-black hover:bg-gray-100 rounded-full"
              >
                <IoChevronForwardOutline size={24} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px text-black">
            {DAYS.map((day) => (
              <div
                key={day}
                className="text-center font-medium text-black p-2"
              >
                {day}
              </div>
            ))}
            {renderCalendar()}
          </div>
        </div>

        {selectedDate && (
          <div className="mt-6 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg text-black font-semibold mb-4">
              Events for {selectedDate.toLocaleDateString()}
            </h3>
            <EventList
              events={events[formatDate(selectedDate)] || []}
              onEditEvent={handleEditEvent}
            />
          </div>
        )}

        {isModalOpen && (
          <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedDate={selectedDate!}
            onSave={handleSaveEvent}
            event={selectedEvent}
            onDelete={handleDeleteEvent}
          />
        )}
      </div>
    </div>
  );
}

export default App;