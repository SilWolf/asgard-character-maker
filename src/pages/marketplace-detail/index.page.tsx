import { getFileByIdAsJSON } from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplate } from "@/types/Baha.type";
import { QueryFunction, useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const queryFn: QueryFunction<unknown, string[]> = ({ queryKey }) =>
  getFileByIdAsJSON<BahaTemplate>(queryKey[2]);

const MarketplaceDetailPage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const { data: template } = useQuery({
    queryKey: ["marketplace", "template", templateId as string],
    queryFn,
    enabled: !!templateId,
  });

  if (!template) {
    return <PublicLayout></PublicLayout>;
  }

  return <PublicLayout></PublicLayout>;
};

export default MarketplaceDetailPage;
