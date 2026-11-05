import { Provider } from "react-redux";
import { BrowserRouter } from "react-router";

import { store } from "@/app/store";

function AppProviders({ children }) {
  return (
    // Provider: নিচের সব component-কে store দেয়। useSelector/useDispatch এর ভেতরেই কাজ করে
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
}

export default AppProviders;