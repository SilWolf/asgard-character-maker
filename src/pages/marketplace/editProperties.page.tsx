import {
  getFileById,
  patchFileProperties,
} from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { Button, FormControl, FormLabel, Textarea } from "@mui/joy";
import { FormEvent, useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import { useAsyncFn, useEffectOnce } from "react-use";

const MarketplaceEditPropertiesPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [properties, setProperties] = useState<string>();

  useEffectOnce(() => {
    if (!templateId) {
      return;
    }

    getFileById(templateId).then((data) => {
      setProperties(JSON.stringify(data.properties, null, 2));
    });
  });

  const [{ loading: isPatching }, patchAsyncFn] =
    useAsyncFn(patchFileProperties);
  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      if (!templateId) {
        return;
      }

      const form = e.currentTarget as HTMLFormElement;
      const data = Object.fromEntries(new FormData(form)) as {
        properties: string;
      };

      patchAsyncFn(templateId, JSON.parse(data.properties));
    },
    [patchAsyncFn, templateId]
  );

  if (!properties) {
    return <PublicLayout />;
  }

  return (
    <PublicLayout>
      <div className="space-y-12 py-4">
        <div className="container mx-auto max-w-screen-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormControl>
              <FormLabel>Properties</FormLabel>
              <Textarea name="properties" defaultValue={properties} />
            </FormControl>

            <Button type="submit" loading={isPatching}>
              更新
            </Button>
          </form>
        </div>
      </div>
    </PublicLayout>
  );
};

export default MarketplaceEditPropertiesPage;
