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
import MarketplaceEditPropertiesPage from "./pages/marketplace/editProperties.page";
import MarketplaceDetailPage from "./pages/marketplace-detail/index.page";
import PreferencePage from "./pages/preference/index.page";
import SheetDetailPublishPage from "./pages/sheet-detail/publish.page";
import ExamplesPage from "./pages/examples/index.page";

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
    path: "/sheet/:sheetId/admin-publish",
    element: <SheetDetailPublishPage />,
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
    path: "/examples",
    element: <ExamplesPage />,
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
    path: "/marketplace/:templateId",
    element: <MarketplaceDetailPage />,
  },
  {
    path: "/marketplace/:templateId/admin-editProperties",
    element: <MarketplaceEditPropertiesPage />,
  },

  {
    path: "/preference",
    element: <PreferencePage />,
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
