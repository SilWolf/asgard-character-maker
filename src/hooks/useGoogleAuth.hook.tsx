import { Button } from "@mui/joy";
import {
  GoogleOAuthProvider,
  TokenResponse,
  useGoogleLogin,
} from "@react-oauth/google";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useCookie } from "react-use";

type GoogleAuthContextValue = {
  token: string | undefined | null;
  setToken: (newValue: string) => unknown;
};

const GoogleAuthContext = React.createContext<GoogleAuthContextValue>({
  token: undefined,
  setToken: () => {},
});

type GoogleAuthProviderProps = PropsWithChildren<{
  clientId: string;
}>;

export const GoogleAuthProvider = ({
  children,
  clientId,
}: GoogleAuthProviderProps) => {
  const [token, updateToken] = useCookie("acm-google-auth-token");
  const setToken = useCallback(
    (newToken: string) => {
      updateToken(newToken, { expires: 1 / 24 });
    },
    [updateToken]
  );

  const value = useMemo(() => ({ token, setToken }), [setToken, token]);

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAuthContext.Provider value={value}>
        {children}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

const useGoogleAuth = () => {
  const { token, setToken } = useContext(GoogleAuthContext);

  const isLogined = useMemo(() => !!token, [token]);

  return {
    isLogined,
    token,
    setToken,
  };
};

export default useGoogleAuth;

type GoogleAuthLoginButtonProps = {
  onSuccess?: (tokenResponse: TokenResponse) => unknown;
  onError?: () => unknown;
};

export const GoogleAuthLoginButton = ({
  onSuccess,
  onError,
}: GoogleAuthLoginButtonProps) => {
  const { setToken } = useGoogleAuth();

  const handleSuccessGoogleLogin = useCallback(
    (tokenResponse: TokenResponse) => {
      setToken(tokenResponse.access_token);
      onSuccess?.(tokenResponse);
    },
    [onSuccess, setToken]
  );

  const handleErrorGoogleLogin = useCallback(() => {
    console.error("Login Failed");
    onError?.();
  }, [onError]);

  const login = useGoogleLogin({
    onSuccess: handleSuccessGoogleLogin,
    onError: handleErrorGoogleLogin,
    scope:
      "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.appdata",
  });

  const handleClickLogin = useCallback(() => {
    login();
  }, [login]);

  return (
    // <GoogleLogin
    //   onSuccess={handleSuccessGoogleLogin}
    //   onError={handleErrorGoogleLogin}
    //   auto_select
    // />
    <Button onClick={handleClickLogin} variant="outlined">
      登入 Google 並援權
    </Button>
  );
};
