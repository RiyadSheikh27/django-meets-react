const STORAGE_KEYS = Object.freeze({
  ACCESS: "todo_access_token",
  REFRESH: "todo_refresh_token",
  USER: "todo_user",
});

// localStorage সবসময় কাজ করে না (private mode, storage পূর্ণ বা বন্ধ করা)।
// তাই প্রতিটি অপারেশন try/catch-এ, যাতে অ্যাপ ক্র্যাশ না করে
const safeGet = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    // storage পাওয়া গেল না: চুপচাপ এড়িয়ে যাই (লগইন এই সেশনে চলবে, reload-এ থাকবে না)
  }
};

const safeRemove = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // উপরের মতোই
  }
};

export const authStorage = {
  getAccessToken: () => safeGet(STORAGE_KEYS.ACCESS),
  getRefreshToken: () => safeGet(STORAGE_KEYS.REFRESH),

  setTokens: ({ access, refresh }) => {
    safeSet(STORAGE_KEYS.ACCESS, access);
    if (refresh) safeSet(STORAGE_KEYS.REFRESH, refresh);
  },

  // localStorage শুধু স্ট্রিং রাখে, তাই অবজেক্টকে JSON স্ট্রিং বানাই ও ফেরত আনি
  getUser: () => {
    const raw = safeGet(STORAGE_KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null; // নষ্ট ডেটা: নেই ধরে নিই
    }
  },
  setUser: (user) => safeSet(STORAGE_KEYS.USER, JSON.stringify(user)),

  // logout-এ সব মুছে দেয়
  clear: () => Object.values(STORAGE_KEYS).forEach(safeRemove),
};