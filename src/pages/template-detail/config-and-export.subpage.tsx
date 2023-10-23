import { deleteFile } from "@/helpers/google-drive.helper";
import useDialog from "@/hooks/useDialog.hook";
import { BahaTemplate } from "@/types/Baha.type";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Props = {
  template: BahaTemplate;
  onSubmit: (newValues: Pick<BahaTemplate, "name" | "author">) => void;
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
      name: template.name,
      author: template.author,
    },
  });

  const handleBlurForm = useCallback(() => {
    onSubmit(getValues());
  }, [getValues, onSubmit]);

  const handleClickDownloadConfigJsonFile = useCallback(() => {
    if (!template) {
      return;
    }

    const filename = `${template.name}.json`;

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

        <section className="space-y-4">
          <h2 className="text-2xl">匯出</h2>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleClickDownloadConfigJsonFile}
          >
            下載模版設定檔 (.json)
          </Button>
        </section>

        <section className="space-y-4">
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
