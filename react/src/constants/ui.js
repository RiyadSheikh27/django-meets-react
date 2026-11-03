// Object.freeze: অবজেক্টটাকে "জমিয়ে" দেয়, যাতে কেউ পরে ভুল করে মান বদলাতে বা যোগ করতে না পারে
// নামগুলো BIG_SNAKE_CASE-এ: এগুলো ধ্রুবক (constant), এই রীতি JS-এও চলে
export const BUTTON_VARIANT = Object.freeze({
  PRIMARY: "primary",
  SECONDARY: "secondary",
  DANGER: "danger",
  GHOST: "ghost",
});

export const BUTTON_SIZE = Object.freeze({
  SM: "sm",
  MD: "md",
  LG: "lg",
});