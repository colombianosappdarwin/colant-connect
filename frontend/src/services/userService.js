import axios from "axios"

const API_URL = "http://127.0.0.1:8000"

const getToken = () => {
  return localStorage.getItem("token")
}

export const getUsers = async () => {
  const token = getToken()

  const response = await axios.get(`${API_URL}/admin/users`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  return response.data
}

export const updateUserRole = async (userId, role) => {
  const token = getToken()

  const response = await axios.put(
    `${API_URL}/admin/users/${userId}/role`,
    { role },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}

export const blockUser = async (userId) => {
  const token = getToken()

  const response = await axios.put(
    `${API_URL}/admin/users/${userId}/block`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  return response.data
}