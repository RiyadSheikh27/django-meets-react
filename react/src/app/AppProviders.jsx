import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";
import { Toaster } from "sonner";

import { store } from "@/app/store";

function AppProviders({ children }) {
  return (
    <Provider store={store}>
      <BrowserRouter>
        {children}
        {/* Toaster একবারই বসে। এরপর toast.success(...) যেকোনো জায়গা থেকে ডাকা যায়।
            richColors: সফল=সবুজ, ত্রুটি=লাল; closeButton: হাতে বন্ধ করার বাটন */}
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </Provider>
  );
}

export default AppProviders;