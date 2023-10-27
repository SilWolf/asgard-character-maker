import googleDriveAxiosInstance, {
  googleDriveRequestProps,
} from "@/services/google-drive.service";
import { getFileMime } from "@/utils/file.util";

export type GoogleDriveFile = {
  id: string;
  name: string;
  createdTime: string;
  modifiedTime: string;
  size: string;
  properties: Record<string, string>;
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

export const getFilesByFolderId = (
  folderId: string,
  options?: {
    isPublic?: boolean;
    rawFilter?: string;
    targetFileName?: string;
    pageSize?: number;
    nextPageToken?: string;
  }
) => {
  const params: Record<string, string> = {
    fields: "files(id,name,createdTime,modifiedTime,size,properties)",
  };

  if (folderId === "appDataFolder") {
    params.q = `trashed=false`;
    params.spaces = "appDataFolder";
  } else {
    params.q = `'${folderId}' in parents and trashed=false`;
  }

  if (options?.targetFileName) {
    params.q += ` and name = '${options.targetFileName}'`;
  }

  if (options?.rawFilter) {
    params.q += ` and ${options.rawFilter}`;
  }

  if (options?.isPublic) {
    params.public = "1";
  }

  if (options?.nextPageToken) {
    params.nextPageToken = options.nextPageToken;
  }

  return googleDriveAxiosInstance
    .get<{ files: GoogleDriveFile[]; nextPageToken: string | null }>("/files", {
      params,
    })
    .then((res) => res.data);
};

export const getPublicFilesByFolderId = (folderId: string) =>
  getFilesByFolderId(folderId, { isPublic: true });

export const getFileByNameAsJSON = async <T extends Record<string, unknown>>(
  fileName: string,
  folderId: string = "appDataFolder"
) => {
  const files = await getFilesByFolderId(folderId, {
    targetFileName: fileName,
  }).then((res) => res.files);

  if (!files || files.length === 0) {
    return undefined;
  }

  const file = files[0];

  return googleDriveAxiosInstance
    .get<T>(`/files/${file.id}`, {
      params: {
        alt: "media",
      },
    })
    .then((res) => res.data);
};

export const getFileById = (
  fileId: string,
  options?: { isPublic?: boolean }
) => {
  const params: Record<string, string> = {
    fields: "id,name,createdTime,modifiedTime,size,properties",
  };

  if (options?.isPublic) {
    params.public = "1";
  }

  return googleDriveAxiosInstance
    .get<GoogleDriveFile>(`/files/${fileId}`, {
      params,
    })
    .then((res) => res.data);
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

export const getPublicFileByIdAsJSON = <T extends Record<string, unknown>>(
  fileId: string
) => {
  return googleDriveAxiosInstance
    .get<T>(`/files/${fileId}`, {
      params: {
        alt: "media",
        public: "1",
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
  parentFolderId: string = "appDataFolder"
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
  parentFolderId?: string
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

export const patchFileProperties = (
  fileId: string,
  properties: Record<string, string | null>
) => {
  return googleDriveAxiosInstance.patch(
    `https://www.googleapis.com/drive/v3/files/${fileId}`,
    {
      properties,
    }
  );
};
