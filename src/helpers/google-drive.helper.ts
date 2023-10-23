import googleDriveAxiosInstance, {
  googleDriveRequestProps,
} from "@/services/google-drive.service";
import { getFileMime } from "@/utils/file.util";

type GoogleDriveFile = {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
};

export const updateGoogleDriveRequestProps = ({
  apiKey,
  token,
}: {
  apiKey?: string | null;
  token?: string | null;
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
  return googleDriveAxiosInstance
    .get<{ files: GoogleDriveFile[] }>("/files", {
      params: {
        q: `'${folderId}' in parents and trashed=false`,
        fields: "files(id,name,createdTime,modifiedTime,size)",
      },
    })
    .then((res) => res.data.files);
};

export const getFileByIdAsJSON = <T extends Record<string, unknown>>(
  fileId: string
) => {
  return googleDriveAxiosInstance
    .get<T>(`/files/${fileId}`, {
      params: {
        alt: "media",
      },
    })
    .then((res) => res.data);
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

export const postUploadFile = (
  file: File | Blob,
  filename: string,
  parentFolderId: string = "root"
) => {
  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob(
      [
        JSON.stringify({
          name: filename,
          mimeType: getFileMime(filename),
          parents: [parentFolderId],
        }),
      ],
      { type: "application/json" }
    )
  );
  formData.append("file", file);

  return googleDriveAxiosInstance.post<{ id: string }>(
    "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const postUploadJsonObjectAsFile = (
  jsonObj: Record<string, unknown>,
  filename: string,
  parentFolderId: string = "root"
) => {
  const blob = new Blob([JSON.stringify(jsonObj, null, 2)], {
    type: "application/json",
  });

  return postUploadFile(blob, filename, parentFolderId);
};

export const patchFile = (
  fileId: string,
  file: File | Blob,
  filename?: string
) => {
  const formData = new FormData();

  if (filename) {
    formData.append(
      "metadata",
      new Blob(
        [
          JSON.stringify({
            name: filename,
          }),
        ],
        { type: "application/json" }
      )
    );
  }

  formData.append("file", file);

  return googleDriveAxiosInstance.patch(
    `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart&fields=id`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
};

export const patchFileWithJsonObject = (
  fileId: string,
  jsonObj: Record<string, unknown>,
  filename?: string
) => {
  const blob = new Blob([JSON.stringify(jsonObj, null, 2)], {
    type: "application/json",
  });

  return patchFile(fileId, blob, filename);
};

export const deleteFile = (fileId: string) => {
  return googleDriveAxiosInstance.delete(
    `https://www.googleapis.com/drive/v3/files/${fileId}`
  );
};

export const copyFile = (fileId: string) => {
  return googleDriveAxiosInstance.post(
    `https://www.googleapis.com/drive/v3/files/${fileId}/copy`
  );
};
