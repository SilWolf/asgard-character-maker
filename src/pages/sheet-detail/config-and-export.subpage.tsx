import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { Sheet } from "@/types/Sheet.type";
import {
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
  onSubmit: (newValues: Pick<Sheet, "name" | "author">) => void;
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
      name: sheet.name,
      author: sheet.author,
    },
  });

  const handleBlurForm = useCallback(() => {
    onSubmit(getValues());
  }, [getValues, onSubmit]);

  const finalBahaCode = useMemo(
    () =>
      sheet?.sections
        .map(({ template, value }) => {
          let replacedCode = template.bahaCode;

          for (const prop of template.props) {
            replacedCode = replacedCode.replace(
              new RegExp(`\\$${prop.id}\\$`, "g"),
              value[prop.id] || prop.defaultValue
            );
          }

          return replacedCode;
        })
        .join("\n") ?? "",
    [sheet?.sections]
  );

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
      content: "此動作無法回溯，請先下載紀錄檔進行備放。確定刪除角色卡嗎？",
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
            <FormLabel>模版名稱</FormLabel>
            <Input {...register("name")} />
          </FormControl>
          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input {...register("author")} />
          </FormControl>
        </form>

        <form className="space-y-4">
          <h2 className="text-2xl">匯出</h2>

          <div className="space-y-4">
            <FormControl>
              <FormLabel>巴哈小屋創作原始碼</FormLabel>
              <Textarea value={finalBahaCode} maxRows={5} />
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
