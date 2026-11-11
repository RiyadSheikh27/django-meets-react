import { ERROR_MESSAGES } from "@/constants/message";

// ফেরত দেয়: { message: string, fieldErrors: { [field]: string }, status: number | null }
export function parseApiError(error) {
  // ১. সার্ভারের উত্তরই আসেনি (নেটওয়ার্ক বন্ধ, timeout, CORS ব্যর্থ, সার্ভার বন্ধ)
  if (!error?.response) {
    return { message: ERROR_MESSAGES.NETWORK, fieldErrors: {}, status: null };
  }

  const { status, data } = error.response;

  // ২. { "detail": "Invalid username or password." } ধরন
  if (typeof data?.detail === "string") {
    return { message: data.detail, fieldErrors: {}, status };
  }

  // ৩. 400 ভ্যালিডেশন: { "title": ["This field is required."] }
  if (status === 400 && data && typeof data === "object") {
    const fieldErrors = {};
    // Object.entries: অবজেক্টকে [কী, মান] জোড়ার array বানায় (Python-এর dict.items()-এর মতো)
    for (const [field, messages] of Object.entries(data)) {
      // মান array হলে জুড়ে একটা স্ট্রিং বানাই
      fieldErrors[field] = Array.isArray(messages)
        ? messages.join(" ")
        : String(messages);
    }
    return { message: ERROR_MESSAGES.VALIDATION, fieldErrors, status };
  }

  // ৪. বাকি সব (500 ইত্যাদি): সাধারণ বার্তা
  return { message: ERROR_MESSAGES.GENERIC, fieldErrors: {}, status };
}