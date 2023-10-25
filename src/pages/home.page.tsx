import {
  copyFile,
  getFilesByFolderId,
  postUploadFile,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import useCustomTemplates from "@/hooks/useCustomTemplates.hook";
import PublicLayout from "@/layouts/public.layout";
import { getNowString, renderHumanDate } from "@/utils/date.util";
import { pickFile } from "@/utils/file.util";
import { Button, Table } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAsyncFn } from "react-use";
import { Link, useNavigate } from "react-router-dom";
import { BahaTemplate } from "@/types/Baha.type";
import { Sheet } from "@/types/Sheet.type";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";

const HomePage = () => {
  const navigate = useNavigate();

  const { setting } = useGoogleAuth();
  const googleDriveSheetsFolderId = setting.sheetsFolderId;

  const {
    data: templates,
    isLoading: isLoadingTemplates,
    refetch: refetchTemplates,
    googleDriveTemplatesFolderId,
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

  const [{ loading: isCreatingSheet }, createSheetAsyncFn] = useAsyncFn(
    postUploadJsonObjectAsFile
  );
  const handleClickCreateSheet = useCallback(() => {
    const name = `未命名角色卡_${getNowString()}`;
    const defaultSheet: Sheet = {
      templatesMap: {
        starter: {
          name: "預設模版",
          bahaCode: "[div]輸入你想要的值：$placeholder$[/div]",
          props: [
            {
              id: "placeholder",
              key: "$placeholder$",
              defaultValue: "預設值",
              label: "文字",
              description: "修改這個值就能填入左側的預覽中",
              category: "text",
            },
          ],
        },
      },
      sectionsMap: {
        section1: {
          id: "section1",
          name: "第一個區塊",
          templateId: "starter",
          value: [{}],
        },
      },
      layout: [
        {
          id: "row1",
          cols: [{ id: "col1", width: "100%", sectionIds: ["section1"] }],
        },
      ],
      properties: {
        name,
        author: "",
        briefing: "",
        description: "",
        demoUrl: "",
        previewImageUrl: "",
        imageUrls: [],
        tags: "",
      },
    };
    toast
      .promise(
        createSheetAsyncFn(
          defaultSheet,
          `${name}.json`,
          googleDriveSheetsFolderId
        ),
        {
          loading: "正在創建一個空白的角色卡",
          success: "創建完成！",
          error: "創建失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then((res) => {
        navigate(`/sheet/${res.data.id}`);
      });
  }, [createSheetAsyncFn, googleDriveSheetsFolderId, navigate]);

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

  const [{ loading: isCreatingTemplate }, createTemplateAsyncFn] = useAsyncFn(
    postUploadJsonObjectAsFile
  );
  const handleClickCreateTemplate = useCallback(() => {
    const newTitle = `未命名模版_${getNowString()}`;
    const defaultTemplate: BahaTemplate = {
      props: [],
      bahaCode: "[div]這是一個新的模版。[/div]",
      properties: {
        name: newTitle,
        author: "",
        briefing: "",
        description: "",
        suitableForNewHome: "0",
        suitableForOldHome: "0",
        suitableForWiki: "0",
        demoUrl: "",
        previewImageUrl: "",
        imageUrls: [],
        tags: "",
      },
    };
    toast
      .promise(
        createTemplateAsyncFn(
          defaultTemplate,
          `${newTitle}.json`,
          googleDriveTemplatesFolderId
        ),
        {
          loading: "正在創建一個空白的模版",
          success: "創建完成！",
          error: "創建失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then((res) => {
        navigate(`/template/${res.data.id}`);
      });
  }, [createTemplateAsyncFn, googleDriveTemplatesFolderId, navigate]);

  const [{ loading: isCopyingFile }, copyFileAsyncFn] = useAsyncFn(copyFile);
  const handleClickCopy = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const fileId = e.currentTarget.getAttribute("data-file-id") as string;
      toast
        .promise(copyFileAsyncFn(fileId), {
          loading: "正在複製新的檔案",
          success: "複製成功",
          error: "複製失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        })
        .then(() => {
          refetchSheets();
          refetchTemplates();
        });
    },
    [copyFileAsyncFn, refetchSheets, refetchTemplates]
  );

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
                  上傳角色卡 (.json)
                </Button>
                <Button
                  size="lg"
                  variant="solid"
                  color="success"
                  onClick={handleClickCreateSheet}
                  loading={isCreatingSheet}
                >
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
                        <Button
                          variant="plain"
                          data-file-id={item.id}
                          onClick={handleClickCopy}
                          loading={isCopyingFile}
                        >
                          複製
                        </Button>
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
                  上傳模版 (.json)
                </Button>
                <Button
                  size="lg"
                  variant="solid"
                  color="success"
                  onClick={handleClickCreateTemplate}
                  loading={isCreatingTemplate}
                >
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
                        <Button
                          variant="plain"
                          data-file-id={item.id}
                          onClick={handleClickCopy}
                          loading={isCopyingFile}
                        >
                          複製
                        </Button>
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
