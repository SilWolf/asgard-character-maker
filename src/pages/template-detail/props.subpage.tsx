import BahaCode from "@/components/BahaCode";
import { BahaTemplate, BahaTemplateProp } from "@/types/Baha.type";
import { FormControl, FormLabel, Input, Table, Textarea } from "@mui/joy";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = {
  template: BahaTemplate;
  onSubmit: (newProps: BahaTemplate["props"]) => void;
};

const TemplateDetailPropsSubPage = ({ template, onSubmit }: Props) => {
  const defaultValueForProps = useMemo(
    () =>
      Object.values(template.props).reduce(
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

  return (
    <div className="h-full mx-auto container flex flex-row gap-x-12">
      <section className="flex-0 shrink mx-auto py-4 px-16 overflow-y-scroll rounded-lg shadow-md shadow-gray-400">
        <div className="baha-preview">
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
