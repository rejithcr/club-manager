export interface Event {
  eventId?: number;
  title: string;
  description?: string;
  name?: string;
  eventDate: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  eventTypeId: Number;
  createdBy: string;
  clubName?: string;
  clubId?: number;
}