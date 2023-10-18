/* eslint-disable no-irregular-whitespace */
import { useCallback, useEffect, useState } from "react";
import BahaCode, { BahaTemplate } from "@/components/BahaCode";
import { useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Textarea,
} from "@mui/joy";
import toast from "react-hot-toast";

const DetailPage = () => {
  const [template, setTemplate] = useState<BahaTemplate | undefined>(undefined);

  const { register, watch, reset } = useForm();
  const values = watch();

  const handleClickBahaPreview = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      console.log(e);
    },
    []
  );

  const handleClickExport = useCallback(() => {
    if (!template) {
      return;
    }
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
        values[prop.id] || prop.defaultValue
      );
    }

    const filename = `asgard character - ${new Date().toISOString()}.txt`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(replacedCode)
    );
    element.setAttribute("download", filename);
    element.click();
  }, [template, values]);

  const handleClickSave = useCallback(() => {
    localStorage.setItem(
      "save",
      JSON.stringify({
        template,
        values,
      })
    );

    toast.success("已儲存");
  }, [template, values]);

  useEffect(() => {
    const saved = localStorage.getItem("save");
    if (!saved) {
      fetch(`/baha-templates/character-sheet-silwolf-v1.json`)
        .then((res) => res.json())
        .then(setTemplate);

      return;
    }

    const savedObj = JSON.parse(saved);
    setTemplate(savedObj.template);
    reset(savedObj.values);
  }, [reset]);

  if (!template) {
    return <></>;
  }

  return (
    <>
      <header
        id="header"
        className="pt-4 container mx-auto text-right space-x-2"
      >
        <Button color="neutral" variant="outlined" onClick={handleClickExport}>
          匯出巴哈創作原始碼
        </Button>
        <Button color="success" onClick={handleClickSave}>
          儲存
        </Button>
      </header>
      <div className="mx-auto container flex flex-row gap-x-4 h-[calc(100vh-60px)] py-4">
        <section className="flex-0 shrink mx-auto py-4 px-16 overflow-y-scroll rounded-lg shadow-md shadow-gray-400">
          <div id="baha-preview" onClick={handleClickBahaPreview}>
            <BahaCode
              code={template.bahaCode}
              template={template}
              values={values}
            />
          </div>
        </section>
        <section className="flex-1 overflow-y-scroll">
          <form>
            <div className="space-y-6">
              <div>
                <p className="text-2xl bold">顏色</p>
                {template.colorProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-gray-100 even:bg-gray-50 py-4 px-4"
                  >
                    <FormControl>
                      <FormLabel>{prop.label}</FormLabel>
                      <Textarea
                        placeholder={prop.defaultValue}
                        {...register(prop.id)}
                      />
                      <FormHelperText>{prop.description}</FormHelperText>
                    </FormControl>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-2xl bold">角色資料</p>
                {template.textProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-gray-100 even:bg-gray-50 py-4 px-4"
                  >
                    <FormControl>
                      <FormLabel>{prop.label}</FormLabel>
                      <Textarea
                        placeholder={prop.defaultValue}
                        {...register(prop.id)}
                      />
                      <FormHelperText>{prop.description}</FormHelperText>
                    </FormControl>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-2xl bold">圖片</p>
                {template.imageProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-gray-100 even:bg-gray-50 py-4 px-4"
                  >
                    <FormControl>
                      <FormLabel>{prop.label}</FormLabel>
                      <Textarea
                        placeholder={prop.defaultValue}
                        {...register(prop.id)}
                      />
                      <FormHelperText>{prop.description}</FormHelperText>
                    </FormControl>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default DetailPage;
