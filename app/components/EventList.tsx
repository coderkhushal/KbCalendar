"use client"
import React from 'react';
import { CalendarEvent } from '@/types';
import { formatTime } from '../utils/calendar';

interface EventListProps {
  events: CalendarEvent[];
  onEditEvent: (event: CalendarEvent) => void;
}

export const EventList: React.FC<EventListProps> = ({ events, onEditEvent }) => {
  return (
    <div className="space-y-2">
      {events.map((event) => (
        <div
          key={event.id}
          onClick={() => onEditEvent(event)}
          className="p-3 bg-white rounded-lg shadow hover:shadow-md cursor-pointer transition-shadow"
        >
          <h3 className="font-medium text-gray-900">{event.title}</h3>
          <p className="text-sm text-gray-600">
            {formatTime(event.startTime)} - {formatTime(event.endTime)}
          </p>
          {event.description && (
            <p className="text-sm text-gray-500 mt-1">{event.description}</p>
          )}
        </div>
      ))}
    </div>
  );
};