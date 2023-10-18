import googleDriveAxiosInstance, {
  googleDriveRequestProps,
} from "@/services/google-drive.service";

export const updateGoogleDriveRequestProps = ({
  apiKey,
  token,
}: {
  apiKey?: string;
  token?: string;
}) => {
  if (apiKey) {
    googleDriveRequestProps.apiKey = apiKey;
  }

  if (token) {
    googleDriveRequestProps.token = token;
  }
};

export const getFiles = () => {
  return googleDriveAxiosInstance.get("/files");
};

export const getFilesByFolderId = (folderId: string) => {
  return googleDriveAxiosInstance.get("/files", {
    params: {
      q: `'${folderId}' in parents and trashed = false`,
    },
  });
};

export const postCreateFolder = (name: string, parentFolderId?: string) => {
  return googleDriveAxiosInstance.post<{
    id: string;
  }>("/files", {
    mimeType: "application/vnd.google-apps.folder",
    name,
    parents: parentFolderId ? [parentFolderId] : undefined,
  });
};
