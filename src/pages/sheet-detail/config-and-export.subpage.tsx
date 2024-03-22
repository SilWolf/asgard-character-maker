import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { Sheet } from "@/types/Sheet.type";
import {
  Alert,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Textarea,
} from "@mui/joy";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  sheet: Sheet;
  sheetId: string;
  onSubmit: (newValues: Pick<Sheet, "properties" | "detailProperties">) => void;
};

const SheetDetailConfigAndExportSubPage = ({
  sheet,
  sheetId,
  onSubmit,
}: Props) => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  const { register, getValues } = useForm({
    defaultValues: {
      properties: sheet.properties,
      detailProperties: sheet.detailProperties,
    },
  });

  const handleBlurForm = useCallback(() => {
    const { detailProperties, ...otherValues } = getValues();

    console.log(detailProperties.imageUrls);

    console.log({
      ...otherValues,
      detailProperties: {
        ...detailProperties,
        imageUrls: detailProperties.imageUrls
          ? (detailProperties.imageUrls as unknown as string).split(",")
          : [],
      },
    });

    onSubmit({
      ...otherValues,
      detailProperties: {
        ...detailProperties,
        imageUrls: detailProperties.imageUrls
          ? (detailProperties.imageUrls as unknown as string).split(",")
          : [],
      },
    });
  }, [getValues, onSubmit]);

  const finalBahaCode = useMemo(() => {
    if (!sheet) {
      return "";
    }

    return sheet.layout
      .filter((row) => !row.hidden)
      .map((row) =>
        row.cols
          .map((col) =>
            col.sectionIds
              .map((sectionId) => {
                const section = sheet.sectionsMap[sectionId];
                if (!section) {
                  return "";
                }

                const template = sheet.templatesMap[section.templateId];
                if (!template) {
                  return "";
                }

                let replacedCode = template.bahaCode;
                const value = section.value[0];

                if (template.props && value) {
                  for (const prop of template.props) {
                    replacedCode = replacedCode.replace(
                      new RegExp(`\\$${prop.id}\\$`, "g"),
                      value[prop.id] || prop.defaultValue
                    );
                  }
                }

                return replacedCode;
              })
              .join("")
          )
          .join("")
      )
      .join("\n");
  }, [sheet]);

  const handleClickCopyBahaCode = useCallback(() => {
    navigator.clipboard.writeText(finalBahaCode);
    toast.success("已複製原始碼");
  }, [finalBahaCode]);

  const handleClickExport = useCallback(() => {
    if (!sheet) {
      return;
    }

    const filename = `asgard character - ${new Date().toISOString()}.txt`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(finalBahaCode)
    );
    element.setAttribute("download", filename);
    element.click();
  }, [sheet, finalBahaCode]);

  const handleClickDelete = useCallback(() => {
    openDialog({
      title: "刪除角色卡",
      content: "此動作無法回溯，請先下載紀錄檔進行備份。確定刪除角色卡嗎？",
      onYes: async () => {
        return deleteFile(sheetId).then(() => {
          toast.success("已刪除角色卡");
          navigate("/");
        });
      },
    });
  }, [navigate, openDialog, sheetId]);

  return (
    <div className="container mx-auto max-w-screen-md">
      <div className="space-y-16">
        <form className="space-y-4" onBlur={handleBlurForm}>
          <h2 className="text-2xl">基本設置</h2>
          <FormControl>
            <FormLabel>角色卡名稱</FormLabel>
            <Input {...register("properties.name")} />
          </FormControl>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl">匯出</h2>

          <div className="space-y-4">
            <FormControl>
              <FormLabel>巴哈小屋創作原始碼</FormLabel>
              <Textarea
                value={finalBahaCode}
                minRows={5}
                maxRows={15}
                readOnly
              />
              <FormHelperText>
                將以上原始碼複製貼上到到小屋創作中，就能得到「總覽」中的效果。
              </FormHelperText>
            </FormControl>
            <div className="space-x-2">
              <Button color="primary" onClick={handleClickCopyBahaCode}>
                複製
              </Button>
              <Button
                color="neutral"
                variant="outlined"
                onClick={handleClickExport}
              >
                下載 .txt 檔
              </Button>
            </div>
          </div>
        </div>

        <form className="space-y-6" onBlur={handleBlurForm}>
          <h2 className="text-2xl">進階設置</h2>

          <Alert color="warning">
            <p>
              除非你打算投稿此角色卡，否則「進階設置」是不需要填寫的，留空即可。
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
              簡介這個角色卡可用於什麼場景、有怎樣的風格。最多60字。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>詳細介紹</FormLabel>
            <Textarea
              {...register("detailProperties.description")}
              minRows={5}
              placeholder={`# 關於這個角色卡

## 特色

# 使用的注意事項

## 修改的建議

## 相關的其他模塊
......

`}
            />
            <FormHelperText>
              詳細介紹這個角色卡、使用時的建議及注意事項、如何修改等等。支援
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
              使用了這個角色卡的示範創作，上限60字符。如果連結太長，可使用{" "}
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
              能形容角色卡的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
            </FormHelperText>
          </FormControl>
        </form>

        <div className="space-y-4">
          <h2 className="text-2xl">其他操作</h2>
          <Button color="danger" variant="outlined" onClick={handleClickDelete}>
            刪除此角色卡
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SheetDetailConfigAndExportSubPage;
