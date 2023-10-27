import usePreference from "@/hooks/usePreference.hook";
import PublicLayout from "@/layouts/public.layout";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/joy";
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

  const handleChangeViewPreviewMode = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.currentTarget.value as
        | "baha-preview-old-home"
        | "baha-preview-new-home"
        | "baha-preview-wiki";
      setPreference((prev) => ({
        ...prev,
        previewMode: newValue,
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
        <form className="space-y-12">
          <FormControl>
            <FormLabel>介面顏色</FormLabel>
            <RadioGroup
              className="max-w-[100px]"
              value={preference.viewMode}
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

          <FormControl>
            <FormLabel>預設預覽介面</FormLabel>
            <RadioGroup
              className="max-w-[140px]"
              value={preference.previewMode}
              onChange={handleChangeViewPreviewMode}
            >
              <Radio
                value="baha-preview-old-home"
                label={<span>舊版小屋</span>}
              />
              <Radio
                value="baha-preview-new-home"
                label={<span>新版小屋</span>}
              />
              <Radio value="baha-preview-wiki" label={<span>Wiki頁面</span>} />
            </RadioGroup>
            <FormHelperText>
              在預覽角色和模板時，會默認顯示選擇的介面
            </FormHelperText>
          </FormControl>
        </form>
      </div>
    </PublicLayout>
  );
};

export default PreferencePage;
