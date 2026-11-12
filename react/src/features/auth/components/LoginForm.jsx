import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "sonner";

import Button from "@/components/common/Button";
import Input from "@/components/common/Input";
import {
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  VALIDATION_MESSAGES,
} from "@/constants/messages";
import { ROUTES } from "@/constants/routes";
import { loginThunk } from "@/features/auth/authSlice";

function LoginForm() {
  const dispatch = useDispatch();
  // useNavigate: কোড থেকে (ক্লিক ছাড়াই) পেজ বদলানোর function
  const navigate = useNavigate();
  // ফর্মের কোনো নির্দিষ্ট ঘরের নয়, পুরো ফর্মের ভুল (যেমন "ভুল পাসওয়ার্ড")
  const [formError, setFormError] = useState(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { username: "", password: "" },
    // onTouched: ঘর ছেড়ে গেলে (blur) প্রথম যাচাই, তারপর প্রতি কী-চাপে। ব্যবহারকারী লেখার মাঝপথে বিরক্ত হয় না
    mode: "onTouched",
  });

  // handleSubmit সব যাচাই ঠিক থাকলেই এটা ডাকে। async, তাই isSubmitting নিজে true/false হয়
  const onSubmit = async (values) => {
    setFormError(null);
    try {
      // unwrap: সফলে payload (user), ব্যর্থতায় throw
      const user = await dispatch(loginThunk(values)).unwrap();
      toast.success(SUCCESS_MESSAGES.LOGIN(user.full_name));
      // replace: history থেকে /login বাদ, তাই Back চাপলে লগইন পেজে ফেরে না
      navigate(ROUTES.TASKS, { replace: true });
    } catch (error) {
      // error = rejectWithValue-র মান: { message, fieldErrors, status }
      // সার্ভার কোনো নির্দিষ্ট ঘরের ভুল জানালে সেই ঘরের নিচেই দেখাই
      let hasFieldError = false;
      Object.entries(error?.fieldErrors ?? {}).forEach(([field, message]) => {
        if (field in values) {
          setError(field, { type: "server", message });
          hasFieldError = true;
        }
      });
      // নইলে পুরো ফর্মের ওপরে একটা সাধারণ বার্তা
      if (!hasFieldError) {
        setFormError(error?.message ?? ERROR_MESSAGES.GENERIC);
      }
    }
  };

  return (
    // noValidate: ব্রাউজারের নিজস্ব ভ্যালিডেশন-বুদবুদ বন্ধ, আমাদের বার্তাই দেখাবে
    // handleSubmit(onSubmit): ⚠️ onSubmit সরাসরি দিলে পেজ reload হয়ে যাবে (Django-র সাধারণ form-POST-এর মতো)
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      {formError && (
        <div
          role="alert"
          className="rounded-lg border border-danger-100 bg-danger-50 p-3 text-sm text-danger-700"
        >
          {formError}
        </div>
      )}

      <Input
        label="Username"
        autoComplete="username"
        error={errors.username?.message}
        // register-এর ফল (name, onChange, onBlur, ref) Input-এ ছড়িয়ে যায়
        // required: "বার্তা" মানে: ফাঁকা হলে এই বার্তা
        {...register("username", {
          required: VALIDATION_MESSAGES.USERNAME_REQUIRED,
        })}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        error={errors.password?.message}
        {...register("password", {
          required: VALIDATION_MESSAGES.PASSWORD_REQUIRED,
        })}
      />

      <Button type="submit" className="w-full" isLoading={isSubmitting}>
        Sign in
      </Button>
    </form>
  );
}

export default LoginForm;