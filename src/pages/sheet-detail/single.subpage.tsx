import BahaCode, { BahaTemplate } from "@/components/BahaCode";
import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

type Props = {
  sectionId: string;
  template: BahaTemplate;
  value: Record<string, string>;
  submitFlag: boolean;
  onSubmit: (sectionId: string, newValue: Record<string, string>) => void;
};

const SheetDetailSingle = ({
  sectionId,
  template,
  value,
  submitFlag,
  onSubmit,
}: Props) => {
  const { register, watch, getValues } = useForm({ defaultValues: value });
  const values = watch();

  useEffect(() => {
    if (submitFlag) {
      onSubmit(sectionId, getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitFlag]);

  return (
    <>
      <section className="flex-0 shrink mx-auto py-4 px-16 overflow-y-scroll rounded-lg shadow-md shadow-gray-400">
        <div className="baha-preview">
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
    </>
  );
};

export default SheetDetailSingle;