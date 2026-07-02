import axios from "axios";
import { API_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getEvents = async () => {
  const token = getToken();

  const response = await axios.get(`${API_URL}/events`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const createEvent = async (eventData) => {
  const token = getToken();

  const response = await axios.post(
    `${API_URL}/events`,
    eventData,
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
    `${API_URL}/events/${eventId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const updateEvent = async (
  eventId,
  eventData
) => {
  const token = getToken();

  const response = await axios.put(
    `${API_URL}/events/${eventId}`,
    eventData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};