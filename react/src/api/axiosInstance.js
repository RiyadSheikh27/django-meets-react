import axios from "axios";

import { API_BASE_URL } from "@/constants/api";

const axiosInstance = axios.create({
  // এই ঠিকানা সব request-এর আগে জুড়ে যাবে: baseURL + "/auth/login/"
  baseURL: API_BASE_URL,
  // ১৫ সেকেন্ডে উত্তর না এলে বাতিল (অনন্তকাল ঝুলে থাকবে না)
  timeout: 15000,
  headers: { Accept: "application/json" },
  // ⚠️ এখানে Content-Type ইচ্ছে করে দিইনি: নিচে দেখুন
});

export default axiosInstance;