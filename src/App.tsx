/* eslint-disable no-irregular-whitespace */
import SheetDetailPage from "./pages/sheet-detail/index.page";
import TemplateDetailPage from "./pages/template-detail/index.page";

import useGoogleAuth from "./hooks/useGoogleAuth.hook";
import { updateGoogleDriveRequestProps } from "./helpers/google-drive.helper";
import { useEffectOnce } from "react-use";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import HomePage from "./pages/home.page";
import LoginPage from "./pages/login.page";
import MarketplacePage from "./pages/marketplace/index.page";

const publicRouter = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
  },
]);

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/sheet/:sheetId",
    element: <SheetDetailPage />,
  },
  {
    path: "/template/:templateId",
    element: <TemplateDetailPage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
]);

const App = () => {
  const { token, isLogined } = useGoogleAuth();

  useEffectOnce(() => {
    updateGoogleDriveRequestProps({
      apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
      token,
    });
  });

  return <RouterProvider router={isLogined ? router : publicRouter} />;
};

export default App;
