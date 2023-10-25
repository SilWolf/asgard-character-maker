import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { BahaTemplate } from "@/types/Baha.type";
import {
  Alert,
  Button,
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
  onSubmit: (newValues: BahaTemplate["properties"]) => void;
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
    defaultValues: {
      ...template.properties,
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
      title: "刪除模版",
      content: "此動作無法回溯，請先下載紀錄檔進行備放。確定刪除模版嗎？",
      onYes: async () => {
        return deleteFile(templateId).then(() => {
          toast.success("已刪除模版");
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
            <FormLabel>模版名稱</FormLabel>
            <Input
              {...register("name", { required: true })}
              className="max-w-[400px]"
            />
          </FormControl>

          {/* <FormControl>
            <FormLabel>適用的頁面</FormLabel>
            <FormHelperText>
              <p>
                <span className="line-through">因為巴哈太垃圾</span>
                巴哈有數種不同的創作頁面，各有不同的排版差異。很少情況下一套模版能用在不同頁面上。
                <br />
                請勾選你認為這模版適合的頁面。
              </p>
            </FormHelperText>
            <div className="grid grid-cols-3 gap-x-4 mt-4">
              <div>
                <Checkbox label="適合新版小屋" />
              </div>
              <div>
                <Checkbox label="適合舊版小屋" />
              </div>
              <div>
                <Checkbox label="適合WIKI" />
              </div>
            </div>
          </FormControl> */}
        </form>

        <form className="space-y-6" onBlur={handleBlurForm}>
          <h2 className="text-2xl">進階設置</h2>

          <Alert color="warning">
            除非你打算投稿此模版，否則「進階設置」是不需要填寫的，留空即可。
          </Alert>

          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input {...register("author")} className="max-w-[200px]" />
            <FormHelperText>
              建議使用 <span className="bold">暱稱 (巴哈帳號)</span>{" "}
              的格式，例如 <span className="bold">銀狼 (silwolf167)</span>。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>介紹</FormLabel>
            <Input {...register("briefing")} />
            <FormHelperText>
              簡介這個模版可用於什麼場景、有怎樣的風格。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>詳細介紹</FormLabel>
            <Textarea
              {...register("description")}
              minRows={5}
              placeholder={`# 關於這個模版

## 特色

# 使用的注意事項

## 修改的建議
......

`}
            />
            <FormHelperText>
              詳細介紹這個模版、使用時的建議及注意事項、如何修改等等。支援
              Markdown。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>示範的小屋創作連結</FormLabel>
            <Input
              {...register("demoUrl")}
              placeholder="https://home.gamer.com.tw/artwork.php?sn=1234567"
            />
            <FormHelperText>使用了這個模版的示範創作。</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>預覽圖片</FormLabel>
            <Input
              {...register("previewImageUrl")}
              placeholder="https://i.imgur.com/image.png"
            />
            <FormHelperText>建議採用 16:9 比例的圖片</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>更多介紹圖片</FormLabel>
            <Input
              {...register("imageUrls")}
              placeholder="https://i.imgur.com/image.png"
            />
            <FormHelperText>用逗號(,)分隔每張圖片網址</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>標籤</FormLabel>
            <Input {...register("tags")} placeholder="新版小屋,簡約,整齊" />
            <FormHelperText>
              能形容模版的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
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
            下載模版設定檔 (.json)
          </Button>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl">其他操作</h2>
          <Button color="danger" variant="outlined" onClick={handleClickDelete}>
            刪除此模版
          </Button>
        </section>
      </div>
    </div>
  );
};

export default TemplateDetailConfigAndExportSubPage;
