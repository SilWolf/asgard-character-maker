import { getFileByIdAsJSON } from "@/helpers/google-drive.helper";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";

const queryFn: QueryFunction = async ({ queryKey }) =>
  getFileByIdAsJSON(queryKey[1] as string);

const TemplateDetailPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: template } = useQuery({
    queryKey: ["template", templateId],
    queryFn,
    enabled: !!templateId,
  });
  return <>{JSON.stringify(template, null, 2)}</>;
};

export default TemplateDetailPage;
