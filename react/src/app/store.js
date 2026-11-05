import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";

// configureStore স্বয়ংক্রিয়ভাবে Redux DevTools ও thunk চালু করে দেয়।
// reducer-এর কী ("auth") = state-এর অংশের নাম: state.auth.user
export const store = configureStore({
  reducer: {
    auth: authReducer,
    // M4-তে এখানে tasks: tasksReducer যোগ হবে
  },
});