export interface CalendarEvent {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  date: string;
}

export interface EventStore {
  [date: string]: CalendarEvent[];
}