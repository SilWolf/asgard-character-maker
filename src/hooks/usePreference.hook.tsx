import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocalStorage } from "react-use";
import { useColorScheme } from "@mui/joy/styles";

export type PreferenceProps = {
  viewMode: "light" | "dark";
  previewMode:
    | "baha-preview-old-home"
    | "baha-preview-new-home"
    | "baha-preview-wiki";
};

const defaultPreference: PreferenceProps = {
  viewMode: "light",
  previewMode: "baha-preview-new-home",
};

type MyPreferenceContextProps = [
  PreferenceProps,
  React.Dispatch<React.SetStateAction<PreferenceProps>>
];

const MyPreferenceContext = React.createContext<MyPreferenceContextProps>([
  defaultPreference,
  () => {},
]);

export const MyPreferenceProvider = ({ children }: PropsWithChildren) => {
  const [storedPreference, setStoredPreference] =
    useLocalStorage<PreferenceProps>("acm-preference", defaultPreference);
  const [runtimePreference, setRuntimePreference] = useState<PreferenceProps>(
    storedPreference ?? defaultPreference
  );
  const { setMode } = useColorScheme();

  const value = useMemo<MyPreferenceContextProps>(
    () => [runtimePreference, setRuntimePreference],
    [runtimePreference]
  );

  useEffect(() => {
    setStoredPreference(runtimePreference);

    // Handle view mode
    setMode(runtimePreference.viewMode);
    document.body.setAttribute("data-view-mode", runtimePreference.viewMode);
  }, [runtimePreference, setMode, setStoredPreference]);

  return (
    <MyPreferenceContext.Provider value={value}>
      {children}
    </MyPreferenceContext.Provider>
  );
};

const usePreference = () => useContext(MyPreferenceContext);

export default usePreference;
