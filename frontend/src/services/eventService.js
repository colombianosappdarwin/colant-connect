import axios from "axios";
import { API_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("token");
};

const EVENTS_URL = `${API_URL}/events/`;

const buildEventFormData = (eventData) => {
  const formData = new FormData();

  formData.append("title", eventData.title || "");
  formData.append("description", eventData.description || "");
  formData.append("location", eventData.location || "");
  formData.append("event_date", eventData.event_date || "");

  if (eventData.image instanceof File) {
    formData.append("image", eventData.image);
  }

  return formData;
};

export const getEvents = async () => {
  const response = await axios.get(EVENTS_URL);
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = getToken();

  const response = await axios.post(
    EVENTS_URL,
    buildEventFormData(eventData),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const token = getToken();

  const response = await axios.put(
    `${EVENTS_URL}${eventId}`,
    buildEventFormData(eventData),
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const deleteEvent = async (eventId) => {
  const token = getToken();

  const response = await axios.delete(
    `${EVENTS_URL}${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};