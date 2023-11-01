import ExampleItemCard from "@/components/ExampleItemCard";
import {
  getFileByIdAsJSON,
  patchFileProperties,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { Sheet } from "@/types/Sheet.type";
import {
  Breadcrumbs,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAsyncFn, useEffectOnce } from "react-use";

const SheetDetailPublishPage = () => {
  const navigate = useNavigate();

  const [sheet, setSheet] = useState<Sheet | undefined>(undefined);
  const { sheetId } = useParams<{ sheetId: string }>();

  const [{ loading: isPublishing }, publishAsyncFn] = useAsyncFn(async () => {
    if (!sheet) {
      return;
    }

    const newName = [
      sheet.properties.name,
      sheet.properties.author,
      sheet.properties.briefing,
      sheet.properties.tags,
      sheet.properties.previewMode === "baha-preview-old-home"
        ? "[O]"
        : undefined,
      sheet.properties.previewMode === "baha-preview-new-home"
        ? "[N]"
        : undefined,
      sheet.properties.previewMode === "baha-preview-wiki" ? "[W]" : undefined,
      sheet.properties.viewMode === "light" ? "[L]" : undefined,
      sheet.properties.viewMode === "dark" ? "[D]" : undefined,
    ]
      .filter((item) => !!item)
      .join(",");

    return postUploadJsonObjectAsFile(
      sheet,
      `${newName}.json`,
      import.meta.env.VITE_GOOGLE_DRIVE_EXAMPLE_FOLDER_ID
    ).then((res) => patchFileProperties(res.data.id, sheet.properties));
  }, [sheet]);

  const handleClickPublish = useCallback(() => {
    if (!sheet) {
      return;
    }

    toast
      .promise(publishAsyncFn(), {
        loading: "正在發佈角色卡",
        success: "發佈成功",
        error: "發佈失敗",
      })
      .then(() => {
        navigate("/examples");
      });
  }, [navigate, publishAsyncFn, sheet]);

  useEffectOnce(() => {
    if (!sheetId) {
      return;
    }

    getFileByIdAsJSON<Sheet>(sheetId).then(setSheet);
  });

  if (!sheet || !sheetId) {
    return <PublicLayout></PublicLayout>;
  }

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-screen-md space-y-6">
        <div className="container mx-auto">
          <Breadcrumbs aria-label="breadcrumbs">
            <Link
              to="/"
              className="text-neutral-800 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-300 no-underline"
            >
              主頁
            </Link>
            <span>角色卡</span>
            <Link
              to={`/sheet/${sheetId}`}
              className="text-neutral-800 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-300 no-underline"
            >
              {sheet.properties.name}
            </Link>
            <span>發佈</span>
          </Breadcrumbs>
        </div>

        <div className="space-y-6">
          <FormControl required>
            <FormLabel>角色卡名稱</FormLabel>
            <Input
              value={sheet.properties.name}
              className="max-w-[400px]"
              readOnly
            />
          </FormControl>

          <div>
            <FormLabel>適用的頁面</FormLabel>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Checkbox
                  label="適合新版小屋"
                  defaultChecked={
                    sheet.properties.previewMode === "baha-preview-new-home"
                  }
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Checkbox
                  label="適合舊版小屋"
                  defaultChecked={
                    sheet.properties.previewMode === "baha-preview-old-home"
                  }
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Checkbox
                  label="適合WIKI"
                  defaultChecked={
                    sheet.properties.previewMode === "baha-preview-wiki"
                  }
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <div>
            <FormLabel>適用的顏色</FormLabel>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Checkbox
                  label={
                    <span>
                      適合明亮模式 <i className="uil uil-sun"></i>
                    </span>
                  }
                  defaultChecked={sheet.properties.viewMode === "light"}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Checkbox
                  label={
                    <span>
                      適合黑闇模式 <i className="uil uil-moon"></i>
                    </span>
                  }
                  defaultChecked={sheet.properties.viewMode === "dark"}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input
              value={sheet.properties.author}
              className="max-w-[200px]"
              readOnly
            />
            <FormHelperText>
              建議使用{" "}
              <span className="text-black dark:text-white">
                暱稱 (巴哈帳號)
              </span>{" "}
              的格式，例如{" "}
              <span className="text-black dark:text-white">
                銀狼 (silwolf167)
              </span>
              。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>介紹</FormLabel>
            <Input value={sheet.properties.briefing} readOnly />
            <FormHelperText>
              簡介這個角色卡可用於什麼場景、有怎樣的風格。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>示範的小屋創作連結</FormLabel>
            <Input
              value={sheet.properties.demoUrl}
              placeholder="https://home.gamer.com.tw/artwork.php?sn=1234567"
              readOnly
            />
            <FormHelperText>使用了這個角色卡的示範創作。</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>預覽圖片</FormLabel>
            <Input
              value={sheet.properties.previewImageUrl}
              placeholder="https://i.imgur.com/image.png"
              readOnly
            />
            <FormHelperText>建議採用 16:9 比例的圖片</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>標籤</FormLabel>
            <Input
              value={sheet.properties.tags}
              placeholder="新版小屋,簡約,整齊"
              readOnly
            />
            <FormHelperText>
              能形容角色卡的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
            </FormHelperText>
          </FormControl>

          <div className="max-w-[320px] mx-auto shadow shadow-neutral-400 dark:shadow-neutral-600 p-4 rounded">
            <ExampleItemCard
              sheetId={sheetId}
              properties={sheet.properties}
              onClickDownload={() => Promise.resolve()}
            />
          </div>

          <Button onClick={handleClickPublish} loading={isPublishing}>
            發佈
          </Button>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SheetDetailPublishPage;
