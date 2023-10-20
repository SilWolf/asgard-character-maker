import { getFileByIdAsJSON } from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const queryFn: QueryFunction = async ({ queryKey }) =>
  getFileByIdAsJSON(queryKey[1] as string);

const TemplateDetailPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: template } = useQuery({
    queryKey: ["template", templateId],
    queryFn,
    enabled: !!templateId,
  });
  return <PublicLayout>{JSON.stringify(template, null, 2)}</PublicLayout>;
};

export default TemplateDetailPage;
