// clsx: শর্তসাপেক্ষে (true/false, অবজেক্ট, array) class স্ট্রিং বানায়
import { clsx } from "clsx";
// tailwind-merge: একে অপরের সাথে দ্বন্দ্ব করা Tailwind class সরিয়ে শুধু পরেরটা রাখে
import { twMerge } from "tailwind-merge";

// ...inputs (rest parameter): যত খুশি আর্গুমেন্ট নেবে (0.2-এর rest মনে করুন)
// ধাপ ১: clsx সব ইনপুট থেকে একটা স্ট্রিং বানায়
// ধাপ ২: twMerge সেই স্ট্রিং থেকে দ্বন্দ্ব মিটিয়ে দেয়
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}