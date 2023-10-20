import {
  getFilesByFolderId,
  postCreateFolder,
  postUploadFile,
} from "@/helpers/google-drive.helper";
import useCustomTemplates from "@/hooks/useCustomTemplates.hook";
import PublicLayout from "@/layouts/public.layout";
import { renderHumanDate } from "@/utils/date.util";
import { pickFile } from "@/utils/file.util";
import { Button, Table } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAsyncFn, useEffectOnce, useLocalStorage } from "react-use";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [googleDriveMasterFolderId, setGoogleDriveMasterFolderId] =
    useLocalStorage<string>("acm-google-drive-master-folder-id", undefined, {
      raw: true,
    });
  const [googleDriveSheetsFolderId, setGoogleDriveSheetsFolderId] =
    useLocalStorage<string>("acm-google-drive-sheets-folder-id", undefined, {
      raw: true,
    });

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
    googleDriveTemplatesFolderId,
    setGoogleDriveTemplatesFolderId,
  } = useCustomTemplates();

  const {
    data: sheets,
    isLoading: isLoadingSheets,
    refetch: refetchSheets,
  } = useQuery({
    queryKey: ["sheets", googleDriveSheetsFolderId],
    queryFn: () =>
      getFilesByFolderId(googleDriveSheetsFolderId as unknown as string),
    enabled: !!googleDriveSheetsFolderId,
  });

  const [{ loading: isUploadingSheet }, uploadSheetAsyncFn] = useAsyncFn(
    postUploadFile,
    []
  );

  const handleClickUploadSheet = useCallback(async () => {
    const file = await pickFile();
    toast
      .promise(uploadSheetAsyncFn(file, file.name, googleDriveSheetsFolderId), {
        loading: (
          <span>
            正在上傳角色卡 <span className="bold">{file.name}</span>
          </span>
        ),
        success: "上傳完成！",
        error: "上傳失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
      })
      .then(() => {
        refetchSheets();
      });
  }, [googleDriveSheetsFolderId, refetchSheets, uploadSheetAsyncFn]);

  const [{ loading: isUploadingTemplate }, uploadTemplateAsyncFn] = useAsyncFn(
    postUploadFile,
    []
  );

  const handleClickUploadTemplate = useCallback(async () => {
    const file = await pickFile();
    toast
      .promise(
        uploadTemplateAsyncFn(file, file.name, googleDriveTemplatesFolderId),
        {
          loading: (
            <span>
              正在上傳自定義模版 <span className="bold">{file.name}</span>
            </span>
          ),
          success: "上傳完成！",
          error: "上傳失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then(() => {
        refetchTemplates();
      });
  }, [googleDriveTemplatesFolderId, refetchTemplates, uploadTemplateAsyncFn]);

  useEffectOnce(() => {
    if (!googleDriveMasterFolderId) {
      toast.promise(
        postCreateFolder("巴哈RPG公會角色卡工具資料庫")
          .then((res) => {
            const parentFolderId = res.data.id;
            setGoogleDriveMasterFolderId(parentFolderId);

            return Promise.all([
              postCreateFolder("角色卡", parentFolderId),
              postCreateFolder("自定義模版", parentFolderId),
            ]);
          })
          .then((results) => {
            const [newSheetsFolderId, newTemplatesFolderId] = results.map(
              (res) => res.data.id
            );

            setGoogleDriveSheetsFolderId(newSheetsFolderId);
            setGoogleDriveTemplatesFolderId(newTemplatesFolderId);
          }),
        {
          loading:
            "偵測到第一次使用此工具，正在在 Google Drive 上初始化所需要的資料夾……",
          success: "初始化成功，作為第一步，點擊「創建新的角色卡」吧。",
          error:
            "初始化失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      );
    }
  });

  return (
    <PublicLayout>
      <div className="container mx-auto">
        <div className="space-y-24">
          <section className="space-y-2">
            <div className="flex justify-between">
              <h1 className="text-2xl bold">你的角色卡</h1>
              <div className="text-right space-x-2">
                <Button
                  size="lg"
                  variant="soft"
                  color="primary"
                  onClick={handleClickUploadSheet}
                  loading={isUploadingSheet}
                >
                  上傳角色卡(.json)
                </Button>
                <Button size="lg" variant="solid" color="success">
                  創建新的角色卡
                </Button>
              </div>
            </div>

            <Table>
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>最後更新日期</th>
                  <th>
                    <p className="text-right">操作</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sheets?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{renderHumanDate(item.modifiedTime)}</td>
                    <td className="text-right">
                      <div className="space-x-1">
                        <Link to={`/sheet/${item.id}`}>
                          <Button data-file-id={item.id}>打開</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!isLoadingSheets && sheets?.length === 0 && (
              <div className="text-center py-16 bg-gray-100 text-sm text-gray-700">
                沒有角色卡
              </div>
            )}
            {isLoadingSheets && (
              <div className="text-center py-16 bg-gray-100 text-sm text-gray-700">
                讀取中...
              </div>
            )}
          </section>

          <section className="space-y-2">
            <div className="flex justify-between">
              <h1 className="text-2xl bold">你的自定義模版</h1>
              <div className="text-right space-x-2">
                <Button
                  size="lg"
                  variant="soft"
                  color="primary"
                  onClick={handleClickUploadTemplate}
                  loading={isUploadingTemplate}
                >
                  上傳新的模版(.json)
                </Button>
                <Button size="lg" variant="solid" color="success">
                  創建新的模版
                </Button>
              </div>
            </div>

            <Table>
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>最後更新日期</th>
                  <th>
                    <p className="text-right">操作</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {templates?.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{renderHumanDate(item.modifiedTime)}</td>
                    <td className="text-right">
                      <div className="space-x-1">
                        <Link to={`/template/${item.id}`}>
                          <Button data-file-id={item.id}>打開</Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            {!isLoadingTemplates && templates?.length === 0 && (
              <div className="text-center py-16 bg-gray-100 text-sm text-gray-700">
                沒有自定義的模版
              </div>
            )}
            {isLoadingTemplates && (
              <div className="text-center py-16 bg-gray-100 text-sm text-gray-700">
                讀取中...
              </div>
            )}
          </section>
        </div>
      </div>
    </PublicLayout>
  );
};

export default HomePage;
