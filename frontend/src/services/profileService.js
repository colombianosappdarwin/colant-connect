import axios from "axios";
import { API_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("token");
};

export const getProfile = async () => {
  const token = getToken();

  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateProfile = async (profileData) => {
  const token = getToken();

  const response = await axios.put(`${API_URL}/auth/profile`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};