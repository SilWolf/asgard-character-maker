import {
  CredentialResponse,
  GoogleLogin,
  GoogleOAuthProvider,
} from "@react-oauth/google";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type GoogleAuthContextValue = {
  token: string | undefined;
  setToken: (newValue: string | undefined) => unknown;
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
  const [token, setToken] = useState<string>();

  const value = useMemo(() => ({ token, setToken }), [token]);

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
  onSuccess?: (credentialResponse: CredentialResponse) => unknown;
  onError?: () => unknown;
};

export const GoogleAuthLoginButton = ({
  onSuccess,
  onError,
}: GoogleAuthLoginButtonProps) => {
  const { setToken } = useGoogleAuth();

  const handleSuccessGoogleLogin = useCallback(
    (credentialResponse: CredentialResponse) => {
      setToken(credentialResponse.credential);
      onSuccess?.(credentialResponse);
    },
    [onSuccess, setToken]
  );

  const handleErrorGoogleLogin = useCallback(() => {
    console.error("Login Failed");
    onError?.();
  }, [onError]);

  return (
    <GoogleLogin
      onSuccess={handleSuccessGoogleLogin}
      onError={handleErrorGoogleLogin}
      auto_select
    />
  );
};
