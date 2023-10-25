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
import DeveloperPage from "./pages/developer/index.page";
import MarketplaceCreatePage from "./pages/marketplace-create/index.page";
import TemplateDetailPublishPage from "./pages/template-detail/publish.page";
import PrivacyPolicyPage from "./pages/privacy-policy";

const publicRouter = createBrowserRouter([
  {
    path: "*",
    element: <LoginPage />,
  },

  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
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
    path: "/template/:templateId/admin-publish",
    element: <TemplateDetailPublishPage />,
  },
  {
    path: "/marketplace",
    element: <MarketplacePage />,
  },
  {
    path: "/developer",
    element: <DeveloperPage />,
  },

  {
    path: "/marketplace/admin-create",
    element: <MarketplaceCreatePage />,
  },

  {
    path: "/privacy-policy",
    element: <PrivacyPolicyPage />,
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
