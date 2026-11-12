export const ERROR_MESSAGES = Object.freeze({
  NETWORK: "Cannot reach the server. Check your connection and try again.",
  GENERIC: "Something went wrong. Please try again.",
  VALIDATION: "Please correct the highlighted fields.",
});

export const VALIDATION_MESSAGES = Object.freeze({
  USERNAME_REQUIRED: "Username is required.",
  PASSWORD_REQUIRED: "Password is required.",
});

export const SUCCESS_MESSAGES = Object.freeze({
  // নাম বসাতে হয়, তাই এটা string নয়, একটা function
  LOGIN: (name) => `Welcome back, ${name}!`,
});