import { fileURLToPath, URL } from "node:url";
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from "@tailwindcss/vite";


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  resolve: {
    alias: {
      // "@" মানে src ফোল্ডার, যাতে লম্বা "../../../" না লিখতে হয়
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
