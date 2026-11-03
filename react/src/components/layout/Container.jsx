import { cn } from "@/utils/cn";

function Container({ className, children }) {
  return (
    // mx-auto: মাঝখানে বসে; max-w-3xl: সর্বোচ্চ ৪৮rem (৭৬৮px) চওড়া
    // px-4 (মোবাইলে ১৬px), sm:px-6 (৬৪০px+ স্ক্রিনে ২৪px): এটাই mobile-first
    <div className={cn("mx-auto w-full max-w-3xl px-4 sm:px-6", className)}>
      {children}
    </div>
  );
}

export default Container;