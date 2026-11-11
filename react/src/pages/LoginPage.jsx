import { useDispatch, useSelector } from "react-redux";

import Button from "@/components/common/Button";
import { BUTTON_VARIANT } from "@/constants/ui";
import { REQUEST_STATUS } from "@/constants/status";
import {
  loginThunk,
  logoutThunk,
  selectAuthError,
  selectAuthStatus,
  selectUser,
} from "@/features/auth/authSlice";

function LoginPage() {
  // dispatch: action (বা thunk) store-এ পাঠানোর function
  const dispatch = useDispatch();

  // useSelector: store থেকে ঠিক যেটুকু দরকার সেটুকুই পড়ে।
  // ওই অংশ বদলালেই কেবল এই component re-render হয়
  const status = useSelector(selectAuthStatus);
  const error = useSelector(selectAuthError);
  const user = useSelector(selectUser);

  // সাময়িক পরীক্ষার ডেটা (আপনার Django ইউজারের সাথে মেলাতে বদলে নিন)
  const handleValidLogin = () => {
    dispatch(loginThunk({ username: "admin", password: "admin" }));
  };
  const handleWrongLogin = () => {
    dispatch(loginThunk({ username: "rahim123", password: "wrong-password" }));
  };
  const handleLogout = () => {
    dispatch(logoutThunk());
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold">Login (test)</h1>

      <p className="text-sm text-content-muted">
        Status: <strong>{status}</strong>
      </p>
      {user && (
        <p className="text-sm text-success-800">
          Logged in as {user.full_name} ({user.username})
        </p>
      )}
      {error && <p className="text-sm text-danger-700">{error.message}</p>}

      <div className="flex flex-col gap-2">
        <Button
          onClick={handleValidLogin}
          isLoading={status === REQUEST_STATUS.LOADING}
        >
          Test login (valid)
        </Button>
        <Button variant={BUTTON_VARIANT.SECONDARY} onClick={handleWrongLogin}>
          Test login (wrong password)
        </Button>
        <Button variant={BUTTON_VARIANT.GHOST} onClick={handleLogout}>
          Test logout
        </Button>
      </div>
    </div>
  );
}

export default LoginPage;