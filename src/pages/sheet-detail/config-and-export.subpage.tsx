import { Sheet } from "@/types/Sheet.type";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@mui/joy";
import { useCallback, useMemo } from "react";
import toast from "react-hot-toast";

type Props = {
  sheet: Sheet;
};

const SheetDetailConfigAndExportSubPage = ({ sheet }: Props) => {
  const finalBahaCode = useMemo(
    () =>
      sheet?.sections
        .map(({ template, value }) => {
          const props = [
            ...template.textProps,
            ...template.systemTextProps,
            ...template.imageProps,
            ...template.colorProps,
          ];

          let replacedCode = template.bahaCode;

          for (const prop of props) {
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

  return (
    <div className="container mx-auto max-w-screen-md">
      <div className="space-y-6">
        <h2 className="text-2xl bold">匯出</h2>
        <div className="space-y-2">
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
              下載巴哈創作原始碼(.txt)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetDetailConfigAndExportSubPage;
