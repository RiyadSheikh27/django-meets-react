import axiosInstance from "@/api/axiosInstance";
import { ENDPOINTS } from "@/constants/api";

export const authApi = {
  // credentials: { username, password }
  // সফল হলে ফেরত: { full_name, username, access, refresh }
  login: async (credentials) => {
    const { data } = await axiosInstance.post(
      ENDPOINTS.AUTH.LOGIN,
      credentials,
    );
    return data;
  },

  // সার্ভারে refresh token বাতিল করে। সফলে 205 আসে; axios 2xx-কে সফলই ধরে
  logout: async (refresh) => {
    await axiosInstance.post(ENDPOINTS.AUTH.LOGOUT, { refresh });
  },

  // ফেরত: { access, refresh } (নতুন জোড়া)। এটা M3-তে ব্যবহার হবে
  refresh: async (refresh) => {
    const { data } = await axiosInstance.post(ENDPOINTS.AUTH.REFRESH, {
      refresh,
    });
    return data;
  },
};