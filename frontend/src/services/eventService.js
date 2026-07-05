import axios from "axios";
import { API_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("token");
};

const EVENTS_URL = `${API_URL}/events/`;

export const getEvents = async () => {
  const response = await axios.get(EVENTS_URL);
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = getToken();

  const response = await axios.post(EVENTS_URL, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const deleteEvent = async (eventId) => {
  const token = getToken();

  const response = await axios.delete(`${EVENTS_URL}${eventId}/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateEvent = async (eventId, eventData) => {
  const token = getToken();

  const response = await axios.put(`${EVENTS_URL}${eventId}/`, eventData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};