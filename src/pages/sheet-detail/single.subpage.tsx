import BahaCode from "@/components/BahaCode";
import { BahaTemplate } from "@/types/Baha.type";
import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  sectionId: string;
  template: Pick<BahaTemplate, "bahaCode" | "props">;
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
  const { register, getValues } = useForm({ defaultValues: value });
  const [thisValue, setThisValue] = useState(value);

  const [colorProps, textProps, urlProps, systemProps] = useMemo(() => {
    const thisColorProps = [];
    const thisTextProps = [];
    const thisUrlProps = [];
    const thisSystemProps = [];

    if (template.props) {
      for (const prop of template.props) {
        if (prop.category === "text") {
          thisTextProps.push(prop);
        } else if (prop.category === "color") {
          thisColorProps.push(prop);
        } else if (prop.category === "url") {
          thisUrlProps.push(prop);
        } else if (prop.category === "system") {
          thisSystemProps.push(prop);
        }
      }
    }

    return [thisColorProps, thisTextProps, thisUrlProps, thisSystemProps];
  }, [template.props]);

  const handleBlurForm = useCallback(() => {
    setThisValue(getValues());
  }, [getValues]);

  useEffect(() => {
    if (submitFlag) {
      onSubmit(sectionId, getValues());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitFlag]);

  return (
    <div className="h-full mx-auto container flex flex-row gap-x-12">
      <section className="flex-0 shrink mx-auto py-4 px-16 overflow-y-scroll rounded-lg shadow-md shadow-neutral-400">
        <div className="baha-preview">
          <BahaCode
            code={template.bahaCode}
            template={template}
            values={thisValue}
          />
        </div>
      </section>
      <section className="flex-1 overflow-y-scroll">
        <form onBlur={handleBlurForm}>
          <div className="space-y-6">
            {colorProps.length > 0 && (
              <div>
                <h2 className="text-2xl bold">顏色</h2>
                {colorProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-800 bg-opacity-25 py-4 px-4"
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
            )}

            {textProps.length > 0 && (
              <div>
                <h2 className="text-2xl bold">角色資料</h2>
                {textProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-800 bg-opacity-25 py-4 px-4"
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
            )}

            {urlProps.length > 0 && (
              <div>
                <h2 className="text-2xl bold">連結</h2>
                {urlProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-800 bg-opacity-25 py-4 px-4"
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
            )}

            {systemProps.length > 0 && (
              <div>
                <h2 className="text-2xl bold">系統用字</h2>
                {systemProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-800 bg-opacity-25 py-4 px-4"
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
            )}
          </div>
        </form>
      </section>
    </div>
  );
};

export default SheetDetailSingle;
