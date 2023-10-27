import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { Sheet } from "@/types/Sheet.type";
import { Alert, Button, FormControl, FormLabel, Textarea } from "@mui/joy";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  sheet: Sheet;
  sheetId: string;
  error: unknown;
};

const SheetDetailErrorSubpage = ({ sheet, sheetId, error }: Props) => {
  const { openDialog } = useDialog();
  const navigate = useNavigate();

  const handleClickDownloadConfigJsonFile = useCallback(() => {
    if (!sheet) {
      return;
    }

    const filename = `${sheet.properties.name}.json`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," +
        encodeURIComponent(JSON.stringify(sheet, null, 2))
    );
    element.setAttribute("download", filename);
    element.click();
  }, [sheet]);

  const handleClickDelete = useCallback(() => {
    openDialog({
      title: "刪除檔案",
      content: "此動作無法回溯，請先下載紀錄檔進行備份。確定刪除檔案嗎？",
      onYes: async () => {
        return deleteFile(sheetId).then(() => {
          toast.success("已刪除檔案");
          navigate("/");
        });
      },
    });
  }, [navigate, openDialog, sheetId]);

  const dataJson = useMemo(() => JSON.stringify(sheet, null, 2), [sheet]);
  const errorJson = useMemo(() => JSON.stringify(error, null, 2), [error]);

  return (
    <div className="container mx-auto max-w-screen-md space-y-8">
      <div className="space-y-4">
        <Alert color="danger">
          檔案錯誤！檔案格式似乎是錯的，沒法正常打開檔案。請選擇下列其中一個操作：
        </Alert>

        <div className="space-x-2">
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClickDownloadConfigJsonFile}
          >
            下載檔案 (.json)
          </Button>

          <Button color="danger" variant="outlined" onClick={handleClickDelete}>
            刪除此檔案
          </Button>
        </div>
      </div>

      <FormControl>
        <FormLabel>JSON 原始碼</FormLabel>
        <Textarea value={dataJson} maxRows={20} readOnly />
      </FormControl>

      <FormControl>
        <FormLabel>錯誤內容</FormLabel>

        <Alert color="danger">
          <pre>{errorJson}</pre>
        </Alert>
      </FormControl>
    </div>
  );
};

export default SheetDetailErrorSubpage;
