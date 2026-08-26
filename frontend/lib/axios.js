import axios from "axios";
import { Platform } from "react-native";

const host = Platform.select({
  android: "10.0.2.2",
  ios: "localhost",
  default: "localhost",
});

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${host}:3000/api`;

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common.Authorization;
  }
};