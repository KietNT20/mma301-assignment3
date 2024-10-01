import axios from "axios";

export const BASE_URL = "https://66f7c380b5d85f31a3438d56.mockapi.io/api";

const apiManager = axios.create({
  baseURL: BASE_URL,
  responseType: "json",
  withCredentials: true,
});

export default apiManager;
