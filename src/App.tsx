/* eslint-disable no-irregular-whitespace */
import SheetDetailPage from "./pages/sheet-detail/index.page";
import TemplateDetailPage from "./pages/template-detail/index.page";

import useGoogleAuth from "./hooks/useGoogleAuth.hook";
import FirstLandingPage from "./pages/first-landing.page";
import HomePage from "./pages/home.page";
import { updateGoogleDriveRequestProps } from "./helpers/google-drive.helper";
import { useEffectOnce } from "react-use";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

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
]);

const App = () => {
  const { isLogined, token } = useGoogleAuth();
  // return <DetailPage />;

  // const hasAccess = hasGrantedAllScopesGoogle(
  //   tokenResponse,
  //   "google-scope-1",
  //   "google-scope-2"
  // );

  useEffectOnce(() => {
    updateGoogleDriveRequestProps({
      apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
      token,
    });
  });

  if (!isLogined) {
    return <FirstLandingPage />;
  }

  return <RouterProvider router={router} />;
};

export default App;
