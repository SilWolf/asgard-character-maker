import usePreference from "@/hooks/usePreference.hook";
import PublicLayout from "@/layouts/public.layout";
import { FormControl, FormLabel, Radio, RadioGroup } from "@mui/joy";
import { useCallback } from "react";

const PreferencePage = () => {
  const [preference, setPreference] = usePreference();

  const handleChangeViewMode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value as "light" | "dark";
      setPreference((prev) => ({
        ...prev,
        viewMode: newValue,
      }));
    },
    [setPreference]
  );

  if (!preference) {
    return <PublicLayout />;
  }

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-screen-md space-y-6">
        <form>
          <FormControl>
            <FormLabel>介面顏色</FormLabel>
            <RadioGroup
              value={preference.viewMode}
              name="radio-buttons-group"
              onChange={handleChangeViewMode}
            >
              <Radio
                value="light"
                label={
                  <span>
                    明亮 <i className="uil uil-sun"></i>
                  </span>
                }
              />
              <Radio
                value="dark"
                label={
                  <span>
                    黑闇 <i className="uil uil-moon"></i>
                  </span>
                }
              />
            </RadioGroup>
          </FormControl>
        </form>
      </div>
    </PublicLayout>
  );
};

export default PreferencePage;
