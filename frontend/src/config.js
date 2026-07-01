export const API_URL = "https://colant-connect-production.up.railway.app";

import { API_URL } from "./config";

axios.post(`${API_URL}/auth/login`, data);