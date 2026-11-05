import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { authApi } from "@/api/authApi";
import { ERROR_MESSAGES } from "@/constants/messages";
import { REQUEST_STATUS } from "@/constants/status";
import { authStorage } from "@/utils/authStorage";
import { parseApiError } from "@/utils/parseApiError";

// ---------- শুরুর state ----------
// reload-এর পরেও লগইন টিকে থাকার কৌশল: store তৈরির সময় localStorage থেকে পড়ে নিই
const getInitialState = () => {
  const user = authStorage.getUser();
  const hasToken = Boolean(authStorage.getAccessToken());

  return {
    user: hasToken ? user : null, // { full_name, username } অথবা null
    isAuthenticated: Boolean(hasToken && user),
    status: REQUEST_STATUS.IDLE,
    error: null, // { message, fieldErrors, status } অথবা null
  };
};

// ---------- thunk: login ----------
export const loginThunk = createAsyncThunk(
  "auth/login", // action-এর নামের উপসর্গ
  // প্রথম আর্গুমেন্ট: dispatch করার সময় যা দেওয়া হয়; দ্বিতীয়: RTK-র সরঞ্জাম ({ rejectWithValue... })
  async (credentials, { rejectWithValue }) => {
    try {
      const data = await authApi.login(credentials);

      // Side effect (localStorage লেখা) অবশ্যই reducer-এ নয়, এখানে!
      // reducer হতে হবে খাঁটি function
      authStorage.setTokens({ access: data.access, refresh: data.refresh });
      const user = { full_name: data.full_name, username: data.username };
      authStorage.setUser(user);

      // ⚠️ token এখানে return করছি না: return মান action payload হয়ে DevTools ও log-এ দেখা যায়
      return user;
    } catch (error) {
      // rejectWithValue: ব্যর্থতার payload হিসেবে আমাদের সাধারণ অবজেক্টটা পাঠায়
      // (raw AxiosError নয়, কারণ সেটা serializable নয়)
      return rejectWithValue(parseApiError(error));
    }
  },
);

// ---------- thunk: logout ----------
export const logoutThunk = createAsyncThunk("auth/logout", async () => {
  const refresh = authStorage.getRefreshToken();
  try {
    // সার্ভারে token বাতিলের চেষ্টা
    if (refresh) await authApi.logout(refresh);
  } catch {
    // সার্ভার ব্যর্থ হলেও ব্যবহারকারী logout করতে চায়: তাই এই ব্যর্থতা এড়িয়ে যাই
  } finally {
    // সার্ভার সফল হোক বা না হোক, ব্রাউজারের তথ্য মুছবই
    authStorage.clear();
  }
});

// ---------- slice ----------
const authSlice = createSlice({
  name: "auth", // action-এর উপসর্গ ও store-এর কী
  initialState: getInitialState(),

  // reducers: সাধারণ, synchronous বদল
  reducers: {
    clearAuthError: (state) => {
      state.error = null; // Immer: "সরাসরি বদল" লেখা যায়
    },
  },

  // extraReducers: slice-এর বাইরের action-এ (এখানে thunk-এর তিন অবস্থায়) সাড়া
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = REQUEST_STATUS.LOADING;
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = REQUEST_STATUS.SUCCEEDED;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = REQUEST_STATUS.FAILED;
        // action.payload আসে rejectWithValue থেকে। অপ্রত্যাশিত ভুলে সেটা undefined, তাই ?? দিয়ে ডিফল্ট
        state.error = action.payload ?? {
          message: ERROR_MESSAGES.GENERIC,
          fieldErrors: {},
          status: null,
        };
      })
      .addCase(logoutThunk.fulfilled, () => {
        // নতুন মান return করলে Immer সেটাই নতুন state ধরে (তখন state বদলানো যাবে না)
        return {
          user: null,
          isAuthenticated: false,
          status: REQUEST_STATUS.IDLE,
          error: null,
        };
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;

// ---------- selectors ----------
// component-এ সরাসরি state.auth.user লেখার বদলে এই function ব্যবহার করব।
// state-এর আকার বদলালে শুধু এখানেই ঠিক করতে হবে
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthStatus = (state) => state.auth.status;
export const selectAuthError = (state) => state.auth.error;