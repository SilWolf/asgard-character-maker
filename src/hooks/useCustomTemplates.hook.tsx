import { getFilesByFolderId } from "@/helpers/google-drive.helper";
import { useQuery } from "@tanstack/react-query";
import { useLocalStorage } from "react-use";

const useCustomTemplates = () => {
  const [googleDriveTemplatesFolderId, setGoogleDriveTemplatesFolderId] =
    useLocalStorage<string>("acm-google-drive-templates-folder-id", undefined, {
      raw: true,
    });

  const queryResult = useQuery({
    queryKey: ["templates", googleDriveTemplatesFolderId],
    queryFn: () =>
      getFilesByFolderId(googleDriveTemplatesFolderId as unknown as string),
    enabled: !!googleDriveTemplatesFolderId,
  });

  return {
    ...queryResult,
    googleDriveTemplatesFolderId,
    setGoogleDriveTemplatesFolderId,
  };
};

export default useCustomTemplates;
