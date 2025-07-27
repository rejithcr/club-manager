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
}

import { get, post, put } from "../utils/http/api";

export const getEvents = async (clubId: number, limit: number, offset: number) => {
  return get("/club/event", { clubId, limit, offset });
};

export const getEventsByStatus = async (clubId: number, status: string, limit: number, offset: number) => {
  return get("/club/event", { clubId, status, limit, offset });
};


export const addEvent = async (event: Event) => {
  return post("/club/event", null, { ...event });
};

export const updateEvent = async (event: Event) => {
  return put("/club/event", null, { ...event });
};

export const getAtendedMembers = async (eventId: string) => {
  return get("/club/event/attendance", { eventId });
};

export const saveEventChanges = (eventId: number | undefined, records: { membershipId: number; present: boolean }[], status: string) => {
  return put("/club/event/attendance", null, { eventId, records, status });
};
