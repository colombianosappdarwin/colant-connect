import axios from "axios"

const API_URL = "http://127.0.0.1:8000"

const getToken = () => {
  return localStorage.getItem("token")
}

export const getProfile = async () => {
  const token = getToken()

  const response = await axios.get(`${API_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updateProfile = async (profileData) => {
  const token = getToken()

  const response = await axios.put(`${API_URL}/auth/me`, profileData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}
