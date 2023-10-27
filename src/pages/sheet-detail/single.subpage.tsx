import BahaCode from "@/components/BahaCode";
import { BahaTemplate } from "@/types/Baha.type";
import { SheetProperties } from "@/types/Sheet.type";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  Tab,
  TabList,
  Tabs,
  Textarea,
} from "@mui/joy";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  sectionId: string;
  template: Pick<BahaTemplate, "bahaCode" | "props">;
  value: Record<string, string>;
  properties: SheetProperties;
  submitFlag: boolean;
  onSubmitValue: (sectionId: string, newValue: Record<string, string>) => void;
  onSubmitProperties: (newProperties: SheetProperties) => void;
};

const SheetDetailSingle = ({
  sectionId,
  template,
  value,
  properties,
  onSubmitValue,
  onSubmitProperties,
}: Props) => {
  const { register, getValues } = useForm({ defaultValues: value });
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
    onSubmitValue(sectionId, getValues());
  }, [getValues, onSubmitValue, sectionId]);

  const handleChangePreview = useCallback(
    (_: unknown, newTab: string | number | null) =>
      onSubmitProperties({
        ...properties,
        previewMode: newTab as SheetProperties["previewMode"],
      }),
    [onSubmitProperties, properties]
  );

  const handleChangeLightOrDark = useCallback(
    (_: unknown, newTab: string | number | null) =>
      onSubmitProperties({
        ...properties,
        viewMode: newTab as SheetProperties["viewMode"],
      }),
    [onSubmitProperties, properties]
  );

  return (
    <div className="relative h-full mx-auto container flex flex-row gap-x-12">
      <div className="absolute top-0 left-0 space-x-2">
        <div className="inline-block">
          <Tabs
            size="sm"
            value={properties.previewMode}
            onChange={handleChangePreview}
          >
            <TabList disableUnderline>
              <Tab
                variant="outlined"
                color="neutral"
                disableIndicator
                indicatorInset
                value="baha-preview-new-home"
              >
                新版小屋
              </Tab>
              <Tab
                variant="outlined"
                color="neutral"
                disableIndicator
                indicatorInset
                value="baha-preview-old-home"
              >
                舊版小屋
              </Tab>
              <Tab
                variant="outlined"
                color="neutral"
                disableIndicator
                indicatorInset
                value="baha-preview-wiki"
              >
                Wiki
              </Tab>
            </TabList>
          </Tabs>
        </div>

        <div className="inline-block">
          <Tabs
            size="sm"
            value={properties.viewMode}
            onChange={handleChangeLightOrDark}
          >
            <TabList disableUnderline>
              <Tab
                variant="outlined"
                color="neutral"
                disableIndicator
                indicatorInset
                value="light"
              >
                <i className="uil uil-sun"></i>
              </Tab>
              <Tab
                variant="outlined"
                color="neutral"
                disableIndicator
                indicatorInset
                value="dark"
              >
                <i className="uil uil-moon"></i>
              </Tab>
            </TabList>
          </Tabs>
        </div>
      </div>

      <section
        className={`flex-0 shrink mx-auto py-4 px-4 overflow-y-scroll rounded-lg shadow-md shadow-neutral-400 dark:shadow-neutral-600 mt-10 baha-preview-${properties.viewMode}`}
      >
        <div className={properties.previewMode}>
          <BahaCode
            code={template.bahaCode}
            template={template}
            values={value}
          />
        </div>
      </section>
      <section className="flex-1 overflow-y-scroll">
        <form onBlur={handleBlurForm}>
          <div className="space-y-12">
            {colorProps.length > 0 && (
              <div>
                <h2 className="text-2xl mb-2">顏色</h2>
                {colorProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-700 !bg-opacity-25 py-4 px-4"
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
                <h2 className="text-2xl mb-2">角色資料</h2>
                {textProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-700 !bg-opacity-25 py-4 px-4"
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
                <h2 className="text-2xl mb-2">連結</h2>
                {urlProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-700 !bg-opacity-25 py-4 px-4"
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
                <h2 className="text-2xl mb-2">系統用字</h2>
                {systemProps.map((prop) => (
                  <div
                    key={prop.id}
                    className="odd:bg-neutral-100 dark:odd:bg-neutral-900 even:bg-neutral-50 dark:even:bg-neutral-700 !bg-opacity-25 py-4 px-4"
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
