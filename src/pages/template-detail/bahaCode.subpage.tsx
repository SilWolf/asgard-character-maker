import { BahaTemplate } from "@/types/Baha.type";
import { FormControl, FormLabel, Textarea } from "@mui/joy";
import { useCallback } from "react";

type Props = {
  template: BahaTemplate;
  onSubmit: (newBahaCode: string) => void;
};

const TemplateDetailBahaCodeSubPage = ({ template, onSubmit }: Props) => {
  const handleBlurBahaCode = useCallback(
    (e: React.FocusEvent<HTMLTextAreaElement>) => {
      onSubmit(e.currentTarget.value);
    },
    [onSubmit]
  );

  return (
    <div className="container max-w-screen-md mx-auto">
      <FormControl>
        <FormLabel>原始碼</FormLabel>
        <Textarea
          minRows={20}
          maxRows={20}
          defaultValue={template.bahaCode}
          onBlur={handleBlurBahaCode}
        />
      </FormControl>
    </div>
  );
};

export default TemplateDetailBahaCodeSubPage;
