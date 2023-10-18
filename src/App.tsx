/* eslint-disable no-irregular-whitespace */
import DetailPage from "./pages/detail.page";

import useGoogleAuth from "./hooks/useGoogleAuth.hook";
import FirstLandingPage from "./pages/first-landing.page";
import { Route } from "wouter";
import HomePage from "./pages/home.page";
import { updateGoogleDriveRequestProps } from "./helpers/google-drive.helper";
import { useEffectOnce } from "react-use";

const App = () => {
  const { isLogined } = useGoogleAuth();
  // return <DetailPage />;

  // const hasAccess = hasGrantedAllScopesGoogle(
  //   tokenResponse,
  //   "google-scope-1",
  //   "google-scope-2"
  // );

  useEffectOnce(() => {
    updateGoogleDriveRequestProps({
      apiKey: import.meta.env.VITE_GOOGLE_DRIVE_API_KEY,
    });
  });

  if (!isLogined) {
    return <FirstLandingPage />;
  }

  return (
    <>
      <Route path="/">
        <HomePage />
      </Route>
      <Route path="/creation/:creationId">
        <DetailPage />
      </Route>
    </>
  );
};

export default App;
