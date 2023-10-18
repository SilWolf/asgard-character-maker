/* eslint-disable no-irregular-whitespace */
import DetailPage from "./pages/detail.page";

import useGoogleAuth from "./hooks/useGoogleAuth.hook";
import FirstLandingPage from "./pages/first-landing.page";

const App = () => {
  const { isLogined } = useGoogleAuth();
  // return <DetailPage />;

  // const hasAccess = hasGrantedAllScopesGoogle(
  //   tokenResponse,
  //   "google-scope-1",
  //   "google-scope-2"
  // );

  if (!isLogined) {
    return <FirstLandingPage />;
  }

  return <DetailPage />;
};

export default App;
