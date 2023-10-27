import MarketplaceItemCard from "@/components/MarketplaceItemCard";
import {
  getFileByIdAsJSON,
  patchFileProperties,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplate } from "@/types/Baha.type";
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

const TemplateDetailPublishPage = () => {
  const navigate = useNavigate();

  const [template, setTemplate] = useState<BahaTemplate | undefined>(undefined);
  const { templateId } = useParams<{ templateId: string }>();

  const [{ loading: isPublishing }, publishAsyncFn] = useAsyncFn(async () => {
    if (!template) {
      return;
    }

    const newName = [
      template.properties.name,
      template.properties.author,
      template.properties.briefing,
      template.properties.tags,
      template.properties.suitableForOldHome ? "[O]" : undefined,
      template.properties.suitableForNewHome ? "[N]" : undefined,
      template.properties.suitableForWiki ? "[W]" : undefined,
      template.properties.suitableForLightMode ? "[L]" : undefined,
      template.properties.suitableForDarkMode ? "[D]" : undefined,
    ]
      .filter((item) => !!item)
      .join(",");

    return postUploadJsonObjectAsFile(
      template,
      `${newName}.json`,
      import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
    ).then((res) => patchFileProperties(res.data.id, template.properties));
  }, [template]);

  const handleClickPublish = useCallback(() => {
    if (!template) {
      return;
    }

    toast
      .promise(publishAsyncFn(), {
        loading: "正在發佈模板",
        success: "發佈成功",
        error: "發佈失敗",
      })
      .then(() => {
        navigate("/marketplace");
      });
  }, [navigate, publishAsyncFn, template]);

  useEffectOnce(() => {
    if (!templateId) {
      return;
    }

    getFileByIdAsJSON<BahaTemplate>(templateId).then(setTemplate);
  });

  if (!template || !templateId) {
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
            <span>模板</span>
            <Link
              to={`/template/${templateId}`}
              className="text-neutral-800 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-300 no-underline"
            >
              {template.properties.name}
            </Link>
            <span>發佈</span>
          </Breadcrumbs>
        </div>

        <div className="space-y-6">
          <FormControl required>
            <FormLabel>模板名稱</FormLabel>
            <Input
              value={template.properties.name}
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
                  defaultChecked={template.properties.suitableForNewHome}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Checkbox
                  label="適合舊版小屋"
                  defaultChecked={template.properties.suitableForOldHome}
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Checkbox
                  label="適合WIKI"
                  defaultChecked={template.properties.suitableForWiki}
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
                  defaultChecked={template.properties.suitableForLightMode}
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
                  defaultChecked={template.properties.suitableForDarkMode}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>

          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input
              value={template.properties.author}
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
            <Input value={template.properties.briefing} readOnly />
            <FormHelperText>
              簡介這個模板可用於什麼場景、有怎樣的風格。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>示範的小屋創作連結</FormLabel>
            <Input
              value={template.properties.demoUrl}
              placeholder="https://home.gamer.com.tw/artwork.php?sn=1234567"
              readOnly
            />
            <FormHelperText>使用了這個模板的示範創作。</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>預覽圖片</FormLabel>
            <Input
              value={template.properties.previewImageUrl}
              placeholder="https://i.imgur.com/image.png"
              readOnly
            />
            <FormHelperText>建議採用 16:9 比例的圖片</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>標籤</FormLabel>
            <Input
              value={template.properties.tags}
              placeholder="新版小屋,簡約,整齊"
              readOnly
            />
            <FormHelperText>
              能形容模板的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
            </FormHelperText>
          </FormControl>

          <div className="max-w-[320px] mx-auto shadow shadow-neutral-400 dark:shadow-neutral-600 p-4 rounded">
            <MarketplaceItemCard
              templateId={templateId}
              properties={template.properties}
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

export default TemplateDetailPublishPage;
