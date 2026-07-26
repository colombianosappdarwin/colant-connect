import axios from "axios";
import { API_URL } from "../config";

const getToken = () => {
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("Authentication token not found.");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getProfile = async () => {
  const response = await axios.get(
    `${API_URL}/auth/me`,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await axios.put(
    `${API_URL}/auth/me`,
    profileData,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};

export const deleteAccount = async (password) => {
  const response = await axios.delete(
    `${API_URL}/auth/delete-account`,
    {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json",
      },
      data: {
        password,
      },
    }
  );

  return response.data;
};