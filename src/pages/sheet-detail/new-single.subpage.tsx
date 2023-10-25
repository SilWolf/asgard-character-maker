import useCustomTemplates from "@/hooks/useCustomTemplates.hook";
import {
  FormControl,
  FormLabel,
  Select,
  Option,
  Input,
  Button,
} from "@mui/joy";
import { nanoid } from "nanoid";
import { FormEvent, useCallback, useMemo } from "react";
import { useAsyncFn } from "react-use";

type Props = {
  sectionsCount: number;
  onSubmit: (newSection: SheetNewSingle) => Promise<unknown>;
};

export type SheetNewSingle = {
  id: string;
  name: string;
  templateId: string;
};

const SheetDetailNewSingleSubPage = ({
  sectionsCount = 0,
  onSubmit,
}: Props) => {
  const { data: templates } = useCustomTemplates();

  const namePlaceholder = useMemo(
    () => `區塊${sectionsCount + 1}`,
    [sectionsCount]
  );

  const [{ loading: isSubmitting }, onSubmitAsyncFn] = useAsyncFn(onSubmit);

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const formJson = Object.fromEntries(formData.entries()) as SheetNewSingle;

      onSubmitAsyncFn({
        id: nanoid(8),
        name: formJson.name || namePlaceholder,
        templateId: formJson.templateId,
      }).then(() => {
        form.reset();
      });
    },
    [namePlaceholder, onSubmitAsyncFn]
  );

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto container max-w-screen-md space-y-6">
        <h2 className="text-xl">新增區塊</h2>
        <div className="shadow shadow-gray-400 p-8 rounded space-y-6">
          <FormControl required>
            <FormLabel>選擇一個模板</FormLabel>
            <Select placeholder="選擇…" name="templateId">
              {templates?.map((template) => (
                <Option key={template.id} value={template.id}>
                  {template.name}
                </Option>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>區塊名稱</FormLabel>
            <Input placeholder={namePlaceholder} name="name" />
          </FormControl>

          <Button type="submit" color="success" loading={isSubmitting}>
            新增區塊
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SheetDetailNewSingleSubPage;
