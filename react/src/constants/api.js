// .env থেকে আসে। VITE_ উপসর্গ না থাকলে এটা undefined হতো (0.3 মনে করুন)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ⚠️ Django-তে URL-এর শেষের "/" গুরুত্বপূর্ণ। ছাড়লে redirect বা 404 হতে পারে (বিশেষত POST-এ)
// যেসব endpoint-এ id লাগে, সেগুলো function: ENDPOINTS.TASKS.DETAIL(5) → "/tasks/5/"
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login/",
    REFRESH: "/auth/token/refresh/",
    LOGOUT: "/auth/logout/",
  },
  TASKS: {
    LIST: "/tasks/",
    DETAIL: (id) => `/tasks/${id}/`,
    IMAGES: (id) => `/tasks/${id}/images/`,
    IMAGE_DETAIL: (taskId, imageId) => `/tasks/${taskId}/images/${imageId}/`,
  },
};