import BahaCode from "@/components/BahaCode";
import usePreference from "@/hooks/usePreference.hook";
import { BahaTemplate, BahaTemplateProp } from "@/types/Baha.type";
import {
  FormControl,
  FormLabel,
  Input,
  Tab,
  TabList,
  Table,
  Tabs,
  Textarea,
} from "@mui/joy";
import { useCallback, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  template: BahaTemplate;
  onSubmit: (newProps: BahaTemplate["props"]) => void;
};

const TemplateDetailPropsSubPage = ({ template, onSubmit }: Props) => {
  const defaultValueForProps = useMemo(
    () =>
      Object.values(template.props ?? {}).reduce(
        (prev, curr) => ({
          ...prev,
          [curr.id]: {
            ...curr,
          },
        }),
        {}
      ) as Record<string, BahaTemplateProp>,
    [template]
  );

  const parsedProps = useMemo<BahaTemplate["props"]>(() => {
    const arr = [...template.bahaCode.matchAll(/\$[^$]+\$/g)].map(
      ([key]) => key
    );

    return arr
      .filter((key, index) => arr.indexOf(key) === index)
      .map((key) => ({
        id: key.substring(1, key.length - 1),
        key,
        label: "",
        description: "",
        defaultValue: "",
        category: "text",
      }));
  }, [template.bahaCode]);

  const { register, getValues } = useForm<Record<string, BahaTemplateProp>>({
    defaultValues: defaultValueForProps,
  });

  const handleBlurForm = useCallback(() => {
    const values = getValues();
    onSubmit(
      parsedProps.map((prop) => ({
        ...prop,
        defaultValue: values[prop.id].defaultValue,
        label: values[prop.id].label,
        description: values[prop.id].description,
      }))
    );
  }, [getValues, onSubmit, parsedProps]);

  const [preference] = usePreference();
  const [bahaCodePreviewClassName, setBahaCodePreviewClassName] =
    useState<string>(preference.previewMode);

  const handleChangePreview = useCallback(
    (_: unknown, newTab: string | number | null) =>
      setBahaCodePreviewClassName(newTab as string),
    []
  );

  const [bahaCodeLightOrDarkClassName, setBahaCodeLightOrDarkClassName] =
    useState<string>(preference.viewMode);

  const handleChangeLightOrDark = useCallback(
    (_: unknown, newTab: string | number | null) =>
      setBahaCodeLightOrDarkClassName(newTab as string),
    []
  );

  return (
    <div className="relative h-full mx-auto container flex flex-row gap-x-12">
      <div className="absolute top-0 left-0 space-x-2">
        <div className="inline-block">
          <Tabs
            size="sm"
            value={bahaCodePreviewClassName}
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
            value={bahaCodeLightOrDarkClassName}
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
        className={`flex-0 shrink mx-auto py-4 px-4 overflow-y-scroll rounded-lg shadow-md shadow-neutral-400 dark:shadow-neutral-600 mt-10 baha-preview-${bahaCodeLightOrDarkClassName}`}
      >
        <div className={bahaCodePreviewClassName}>
          <BahaCode
            code={template.bahaCode}
            template={template}
            values={{}}
            alwaysFallbackKeys
          />
        </div>
      </section>
      <section className="flex-1 overflow-y-scroll">
        <form onBlur={handleBlurForm}>
          <div className="space-y-6">
            <Table>
              <thead>
                <tr>
                  <th>欄位</th>
                  <th className="w-4/5"></th>
                </tr>
              </thead>
              <tbody>
                {parsedProps.map(({ id, key }) => (
                  <tr key={id}>
                    <td>{key}</td>
                    <td>
                      <div className="grid grid-cols-3 gap-1">
                        <div>
                          <FormControl>
                            <FormLabel>標籤</FormLabel>
                            <Input {...register(`${id}.label`)} />
                          </FormControl>
                        </div>
                        <div>
                          <FormControl>
                            <FormLabel>分類</FormLabel>
                            <select
                              {...register(`${id}.category`)}
                              className="px-3 py-[6px] rounded-md border border-gray-300 dark:border-gray-700 dark:bg-neutral-900 text-[16px]"
                            >
                              <option value="text">文字</option>
                              <option value="color">顏色</option>
                              <option value="url">連結</option>
                              <option value="system">系統用字</option>
                            </select>
                          </FormControl>
                        </div>
                        <div className="col-span-2">
                          <FormControl>
                            <FormLabel>說明</FormLabel>
                            <Input {...register(`${id}.description`)} />
                          </FormControl>
                        </div>
                        <div className="col-span-3">
                          <FormControl>
                            <FormLabel>預設值</FormLabel>
                            <Textarea {...register(`${id}.defaultValue`)} />
                          </FormControl>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </form>
      </section>
    </div>
  );
};

export default TemplateDetailPropsSubPage;
