import { getFilesByFolderId } from "@/helpers/google-drive.helper";
import { useQuery } from "@tanstack/react-query";
import useGoogleAuth from "./useGoogleAuth.hook";

const useCustomTemplates = () => {
  const { setting } = useGoogleAuth();
  const googleDriveTemplatesFolderId = setting.templatesFolderId;

  const queryResult = useQuery({
    queryKey: ["templates", googleDriveTemplatesFolderId],
    queryFn: () =>
      getFilesByFolderId(googleDriveTemplatesFolderId as unknown as string),
    enabled: !!googleDriveTemplatesFolderId,
  });

  return {
    ...queryResult,
    googleDriveTemplatesFolderId,
  };
};

export default useCustomTemplates;
