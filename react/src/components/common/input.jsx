import { useId, useState } from "react";

import Button from "@/components/common/Button";
import { BUTTON_VARIANT } from "@/constants/ui";
import { cn } from "@/utils/cn";

// আইকন: পাসওয়ার্ড দেখানো/লুকানোর জন্য (aria-hidden: স্ক্রিন-রিডার উপেক্ষা করবে)
function EyeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

// text-base (১৬px): ⚠️ ১৬px-এর ছোট হলে iPhone Safari ঘরে ফোকাস করলে পেজ জুম করে ফেলে
// min-h-11: ৪৪px (touch target); focus:ring-2: ফোকাসে স্পষ্ট রিং
const BASE_CLASSES =
  "block min-h-11 w-full rounded-lg border bg-surface px-3 py-2 text-base text-content placeholder:text-content-muted focus:ring-2 focus:outline-hidden disabled:cursor-not-allowed disabled:bg-surface-muted disabled:opacity-60";

const NORMAL_CLASSES =
  "border-line-strong focus:border-brand-600 focus:ring-brand-500";
const ERROR_CLASSES =
  "border-danger-600 focus:border-danger-600 focus:ring-danger-600";

// React 19: ref এখন সাধারণ prop। react-hook-form-এর register() এটাই পাঠায়
function Input({
  ref,
  id,
  label,
  type = "text",
  error, // ত্রুটির বার্তা (স্ট্রিং)। থাকলে ঘর লাল হয়
  hint, // সাহায্যকারী ছোট লেখা (ঐচ্ছিক)
  className,
  ...rest // name, onChange, onBlur, placeholder, autoComplete, disabled... সব সোজা <input>-এ
}) {
  // useId: label ও input জুড়তে অনন্য id। বাইরে থেকে id দিলে সেটাই
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const hintId = `${inputId}-hint`;

  const isPassword = type === "password";
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // দেখানো অবস্থায় type বদলে "text" করে দিই
  const resolvedType = isPassword && isPasswordVisible ? "text" : type;

  const showHint = Boolean(hint) && !error;
  // aria-describedby: স্ক্রিন-রিডার ঘরে ফোকাস করলে এই element-এর লেখাও পড়ে শোনায়
  const describedBy = error ? errorId : showHint ? hintId : undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        // htmlFor + id: label-এ ক্লিক করলে ঘরে ফোকাস যায়; স্ক্রিন-রিডার ঘরের নাম জানে
        <label htmlFor={inputId} className="block text-sm font-medium text-content">
          {label}
        </label>
      )}

      {/* relative: ভেতরের absolute বাটনের হিসাব এই বাক্স থেকে */}
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          // aria-invalid: ঘরে ভুল আছে, স্ক্রিন-রিডারকে জানায়
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            BASE_CLASSES,
            error ? ERROR_CLASSES : NORMAL_CLASSES,
            // পাসওয়ার্ডে ডান দিকে বাটনের জন্য জায়গা
            isPassword && "pr-12",
            className,
          )}
          {...rest}
        />

        {isPassword && (
          // আমাদের একমাত্র Button। type="button" ডিফল্ট, তাই ফর্ম জমা দেবে না (1.4-এর শিক্ষা)
          <Button
            variant={BUTTON_VARIANT.GHOST}
            className="absolute top-0 right-0 size-11 px-0"
            // নাম স্থির, অবস্থা aria-pressed-এ: দুটো একসাথে বদলালে স্ক্রিন-রিডার দুবার বলে
            aria-label="Show password"
            aria-pressed={isPasswordVisible}
            disabled={rest.disabled}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
          >
            {isPasswordVisible ? <EyeOffIcon /> : <EyeIcon />}
          </Button>
        )}
      </div>

      {showHint && (
        <p id={hintId} className="text-sm text-content-muted">
          {hint}
        </p>
      )}
      {error && (
        // role="alert": ভুল দেখা দিলেই স্ক্রিন-রিডার সঙ্গে সঙ্গে পড়ে শোনায়
        <p id={errorId} role="alert" className="text-sm text-danger-700">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;