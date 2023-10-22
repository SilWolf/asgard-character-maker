import { BahaTemplate } from "@/types/Baha.type";
import { Button, FormControl, FormLabel, Input } from "@mui/joy";
import { useCallback } from "react";
import { useForm } from "react-hook-form";

type Props = {
  template: BahaTemplate;
  onSubmit: (newValues: Pick<BahaTemplate, "name" | "author">) => void;
};

const TemplateDetailConfigAndExportSubPage = ({
  template,
  onSubmit,
}: Props) => {
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
      </div>
    </div>
  );
};

export default TemplateDetailConfigAndExportSubPage;
