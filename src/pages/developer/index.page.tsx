import {
  deleteFile,
  getFileByNameAsJSON,
  getFilesByFolderId,
} from "@/helpers/google-drive.helper";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import PublicLayout from "@/layouts/public.layout";
import { Button, FormControl, FormLabel, Input, Textarea } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { FormEvent, MouseEvent, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { useAsyncFn } from "react-use";

const DeveloperPage = () => {
  const { setting } = useGoogleAuth();
  const settingJson = useMemo(
    () => JSON.stringify(setting, null, 2),
    [setting]
  );

  const { data: onlineSetting, refetch: refetchOnlineSetting } = useQuery({
    queryKey: ["setting"],
    queryFn: () =>
      getFileByNameAsJSON("setting.json").then((json) =>
        JSON.stringify(json, null, 2)
      ),
  });

  const { data: files } = useQuery({
    queryKey: ["googleDrive-files"],
    queryFn: () =>
      getFilesByFolderId("appDataFolder").then((json) =>
        JSON.stringify(json, null, 2)
      ),
  });

  const handleClickRefreshOnlineSetting = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      refetchOnlineSetting();
    },
    [refetchOnlineSetting]
  );

  const [{ loading: isDeletingFile }, deleteFileAsyncFn] =
    useAsyncFn(deleteFile);
  const handleSubmitDeleteFile = useCallback(
    (e: FormEvent) => {
      e.preventDefault();
      const form = e.currentTarget as HTMLFormElement;

      const data = Object.fromEntries(new FormData(form)) as { fileId: string };

      toast.promise(
        deleteFileAsyncFn(data.fileId).then(() => {
          form.reset();
        }),
        {
          loading: "刪除中…",
          success: "刪除成功",
          error: "刪除失敗",
        }
      );
    },
    [deleteFileAsyncFn]
  );

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-screen-md space-y-12">
        <FormControl>
          <FormLabel>本地儲存的 Setting JSON</FormLabel>
          <Textarea value={settingJson} minRows={10} maxRows={10} />
        </FormControl>

        <FormControl>
          <FormLabel>
            Google Drive儲存的 Setting JSON (
            <a href="#" onClick={handleClickRefreshOnlineSetting}>
              刷新
            </a>
            )
          </FormLabel>
          <Textarea value={onlineSetting} minRows={10} maxRows={10} />
        </FormControl>

        <FormControl>
          <FormLabel>Google Drive儲存的檔案</FormLabel>
          <Textarea value={files} minRows={10} maxRows={10} />
        </FormControl>

        <form onSubmit={handleSubmitDeleteFile}>
          <FormControl>
            <FormLabel>用ID刪除檔案</FormLabel>
            <div className="flex gap-x-2">
              <Input name="fileId" disabled={isDeletingFile} />
              <div className="shrink-0">
                <Button type="submit" color="danger" loading={isDeletingFile}>
                  刪除
                </Button>
              </div>
            </div>
          </FormControl>
        </form>
      </div>
    </PublicLayout>
  );
};

export default DeveloperPage;
