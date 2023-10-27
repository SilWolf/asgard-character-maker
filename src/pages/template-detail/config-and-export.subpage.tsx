import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { BahaTemplate } from "@/types/Baha.type";
import {
  Alert,
  Button,
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@mui/joy";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  template: BahaTemplate;
  onSubmit: (newValue: {
    properties: BahaTemplate["properties"];
    detailProperties: BahaTemplate["detailProperties"];
  }) => void;
  templateId: string;
};

const TemplateDetailConfigAndExportSubPage = ({
  template,
  onSubmit,
  templateId,
}: Props) => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  const { register, getValues } = useForm({
    mode: "onBlur",
    defaultValues: {
      properties: { ...template.properties },
      detailProperties: { ...template.detailProperties },
    },
  });

  const handleBlurForm = useCallback(() => {
    onSubmit(getValues());
  }, [getValues, onSubmit]);

  const handleClickDownloadConfigJsonFile = useCallback(() => {
    if (!template) {
      return;
    }

    const filename = `${template.properties.name}.json`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(template, null, 2))
    );
    element.setAttribute("download", filename);
    element.click();
  }, [template]);

  const handleClickDelete = useCallback(() => {
    openDialog({
      title: "刪除模板",
      content: "此動作無法回溯，請先下載紀錄檔進行備份。確定刪除模板嗎？",
      onYes: async () => {
        return deleteFile(templateId).then(() => {
          toast.success("已刪除模板");
          navigate("/");
        });
      },
    });
  }, [navigate, openDialog, templateId]);

  return (
    <div className="container mx-auto max-w-screen-md">
      <div className="space-y-16">
        <form className="space-y-6" onBlur={handleBlurForm}>
          <h2 className="text-2xl">基本設置</h2>
          <FormControl required>
            <FormLabel>模板名稱</FormLabel>
            <Input
              {...register("properties.name", { required: true })}
              className="max-w-[400px]"
            />
          </FormControl>

          <div>
            <FormLabel>適用的頁面</FormLabel>
            <FormHelperText>
              <p>
                <span className="line-through">因為巴哈太垃圾</span>
                巴哈有數種不同的創作頁面，各有不同的排版差異。
                <br />
                很少情況下一套模板能用在不同頁面上。
                請勾選你認為這模板適合的頁面。
                <br />
                <br />
                關於每種介面之間的差異，可參考 「如何使用？#介面差異」{" "}
                <i className="uil uil-external-link-alt"></i>
              </p>
            </FormHelperText>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <Checkbox
                  label="適合新版小屋"
                  {...register("properties.suitableForNewHome")}
                  defaultChecked={template.properties.suitableForNewHome}
                />
              </div>
              <div>
                <Checkbox
                  label="適合舊版小屋"
                  {...register("properties.suitableForOldHome")}
                  defaultChecked={template.properties.suitableForOldHome}
                />
              </div>
              <div>
                <Checkbox
                  label="適合WIKI"
                  {...register("properties.suitableForWiki")}
                  defaultChecked={template.properties.suitableForWiki}
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
                  {...register("properties.suitableForLightMode")}
                  defaultChecked={template.properties.suitableForLightMode}
                />
              </div>
              <div>
                <Checkbox
                  label={
                    <span>
                      適合黑闇模式 <i className="uil uil-moon"></i>
                    </span>
                  }
                  {...register("properties.suitableForDarkMode")}
                  defaultChecked={template.properties.suitableForDarkMode}
                />
              </div>
            </div>
          </div>
        </form>

        <form className="space-y-6" onBlur={handleBlurForm}>
          <h2 className="text-2xl">進階設置</h2>

          <Alert color="warning">
            <p>
              除非你打算投稿此模板，否則「進階設置」是不需要填寫的，留空即可。
              <br />
              關於投稿，請參閱{" "}
              <span>
                「如何使用？#投稿模板」{" "}
                <i className="uil uil-external-link-alt"></i>
              </span>
            </p>
          </Alert>

          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input
              {...register("properties.author")}
              className="max-w-[300px]"
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
            <Input
              {...register("properties.briefing")}
              slotProps={{ input: { maxLength: 60 } }}
            />
            <FormHelperText>
              簡介這個模板可用於什麼場景、有怎樣的風格。最多60字。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>詳細介紹</FormLabel>
            <Textarea
              {...register("detailProperties.description")}
              minRows={5}
              placeholder={`# 關於這個模板

## 特色

# 使用的注意事項

## 修改的建議

## 相關的其他模塊
......

`}
            />
            <FormHelperText>
              詳細介紹這個模板、使用時的建議及注意事項、如何修改等等。支援
              Markdown。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>示範的小屋創作連結</FormLabel>
            <Input
              {...register("properties.demoUrl", {
                maxLength: {
                  value: 60,
                  message: "網址太長了，請自行縮短網址。",
                },
              })}
              placeholder="https://home.gamer.com.tw/artwork.php?sn=1234567"
            />
            <FormHelperText>
              使用了這個模板的示範創作，上限60字符。如果連結太長，可使用{" "}
              <a href="https://cleanuri.com/" target="_blank">
                Cleanuri.com <i className="uil uil-external-link-alt"></i>
              </a>{" "}
              縮短
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>預覽圖片</FormLabel>
            <Input
              {...register("properties.previewImageUrl", {
                maxLength: {
                  value: 60,
                  message: "網址太長了，請自行縮短網址。",
                },
              })}
              placeholder="https://i.imgur.com/image.png"
            />
            <FormHelperText>
              建議採用 16:9 比例的圖片，上限60字符。如果連結太長，可使用{" "}
              <a href="https://cleanuri.com/" target="_blank">
                Cleanuri.com <i className="uil uil-external-link-alt"></i>
              </a>{" "}
              縮短
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>更多介紹圖片</FormLabel>
            <Input
              {...register("detailProperties.imageUrls")}
              placeholder="https://i.imgur.com/image1.png,https://i.imgur.com/image2.png"
            />
            <FormHelperText>用逗號(,)分隔每張圖片網址</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>標籤</FormLabel>
            <Input
              {...register("properties.tags")}
              placeholder="新版小屋,簡約,整齊"
            />
            <FormHelperText>
              能形容模板的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
            </FormHelperText>
          </FormControl>
        </form>

        <section className="space-y-6">
          <h2 className="text-2xl">匯出</h2>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClickDownloadConfigJsonFile}
          >
            下載模板設定檔 (.json)
          </Button>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">其他操作</h2>
          <Button color="danger" variant="outlined" onClick={handleClickDelete}>
            刪除此模板
          </Button>
        </section>
      </div>
    </div>
  );
};

export default TemplateDetailConfigAndExportSubPage;
