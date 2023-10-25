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

export type GoogleDriveAppSetting = {
  sheetsFolderId: string;
  templatesFolderId: string;
};

type GoogleAuthContextValue = {
  token: string | undefined | null;
  setToken: (newValue: string) => unknown;
  setting: GoogleDriveAppSetting;
  setSetting: (newValue: GoogleDriveAppSetting) => unknown;
};

const GoogleAuthContext = React.createContext<GoogleAuthContextValue>({
  token: undefined,
  setToken: () => {},
  setting: {
    sheetsFolderId: "",
    templatesFolderId: "",
  },
  setSetting: () => {},
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
      updateToken(newToken, { expires: 4 / 24 });
    },
    [updateToken]
  );

  const [rawSetting, updateSetting] = useCookie("acm-google-drive-setting");
  const setSetting = useCallback(
    (newSetting: GoogleDriveAppSetting) => {
      updateSetting(JSON.stringify(newSetting), { expires: 4 / 24 });
    },
    [updateSetting]
  );

  const setting = useMemo(() => {
    if (!rawSetting) {
      return {
        sheetsFolderId: "",
        templatesFolderId: "",
      };
    }

    return JSON.parse(rawSetting) as GoogleDriveAppSetting;
  }, [rawSetting]);

  const value = useMemo(
    () => ({ token, setToken, setting, setSetting }),
    [setToken, token, setting, setSetting]
  );

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleAuthContext.Provider value={value}>
        {children}
      </GoogleAuthContext.Provider>
    </GoogleOAuthProvider>
  );
};

const useGoogleAuth = () => {
  const { token, setToken, setting, setSetting } =
    useContext(GoogleAuthContext);

  const isLogined = useMemo(
    () => !!token && !!setting.sheetsFolderId && !!setting.templatesFolderId,
    [token, setting]
  );

  return {
    isLogined,
    token,
    setToken,
    setting,
    setSetting,
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
    <Button onClick={handleClickLogin} variant="outlined">
      登入 Google 並援權
    </Button>
  );
};
