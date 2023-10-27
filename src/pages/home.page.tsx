import {
  copyFile,
  getFilesByFolderId,
  patchFileProperties,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import useCustomTemplates from "@/hooks/useCustomTemplates.hook";
import PublicLayout from "@/layouts/public.layout";
import { getNowString, renderHumanDate } from "@/utils/date.util";
import { pickFile, readJsonFromFile } from "@/utils/file.util";
import { Button, Table } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useAsyncFn } from "react-use";
import { Link, useNavigate } from "react-router-dom";
import { BahaTemplate } from "@/types/Baha.type";
import { Sheet } from "@/types/Sheet.type";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import usePreference from "@/hooks/usePreference.hook";
import { validateJson } from "@/utils/json.util";

const HomePage = () => {
  const navigate = useNavigate();

  const { setting } = useGoogleAuth();
  const [preference] = usePreference();

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

  const [{ loading: isCreatingSheet }, createSheetAsyncFn] = useAsyncFn(
    (jsonObj: Record<string, unknown>, name: string, parentFolderId?: string) =>
      postUploadJsonObjectAsFile(jsonObj, `${name}.json`, parentFolderId).then(
        (res) =>
          patchFileProperties(res.data.id, {
            name,
            author: "",
            briefing: "",
            demoUrl: "",
            previewImageUrl: "",
            tags: "",
            viewMode: preference.viewMode,
            previewMode: preference.previewMode,
          })
      )
  );
  const handleClickCreateSheet = useCallback(() => {
    const name = `未命名角色卡_${getNowString()}`;
    const defaultSheet: Sheet = {
      schemaVersion: "1",
      templatesMap: {
        starter: {
          name: "預設模板",
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
        demoUrl: "",
        previewImageUrl: "",
        tags: "",
        viewMode: preference.viewMode,
        previewMode: preference.previewMode,
      },
      detailProperties: {
        description: "",
        imageUrls: [],
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
  }, [
    createSheetAsyncFn,
    googleDriveSheetsFolderId,
    navigate,
    preference.previewMode,
    preference.viewMode,
  ]);

  const handleClickUploadSheet = useCallback(async () => {
    const file = await pickFile();
    const uploadedSheet = await readJsonFromFile<Sheet>(file);
    const jsonValidateResult = await validateJson(
      uploadedSheet,
      "/json-schema/sheet-v1.schema.json"
    );

    if (!jsonValidateResult.valid) {
      toast.error(
        "上傳的檔案格式有誤，請檢查檔案內容。詳細錯誤請打開 F12 主控台查看。"
      );
      console.error(jsonValidateResult.errors);
      return;
    }

    toast
      .promise(
        createSheetAsyncFn(
          uploadedSheet,
          `${uploadedSheet.properties.name}.json`,
          googleDriveSheetsFolderId
        ),
        {
          loading: "上傳角色卡中……",
          success: "創建完成！",
          error: "創建失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then((res) => {
        navigate(`/sheet/${res.data.id}`);
      });
  }, [createSheetAsyncFn, googleDriveSheetsFolderId, navigate]);

  const [{ loading: isCreatingTemplate }, createTemplateAsyncFn] = useAsyncFn(
    (jsonObj: BahaTemplate, name: string, parentFolderId?: string) =>
      postUploadJsonObjectAsFile(jsonObj, `${name}.json`, parentFolderId).then(
        (res) => patchFileProperties(res.data.id, jsonObj.properties)
      )
  );
  const handleClickCreateTemplate = useCallback(() => {
    const newTitle = `未命名模板_${getNowString()}`;
    const defaultTemplate: BahaTemplate = {
      schemaVersion: "1",
      props: [],
      bahaCode: "[div]這是一個新的模板。[/div]",
      properties: {
        name: newTitle,
        author: "",
        briefing: "",
        suitableForNewHome: "0",
        suitableForOldHome: "0",
        suitableForWiki: "0",
        suitableForLightMode: "0",
        suitableForDarkMode: "0",
        demoUrl: "",
        previewImageUrl: "",
        tags: "",
      },
      detailProperties: {
        description: "",
        imageUrls: [],
      },
    };
    toast
      .promise(
        createTemplateAsyncFn(
          defaultTemplate,
          newTitle,
          googleDriveTemplatesFolderId
        ),
        {
          loading: "正在創建一個空白的模板",
          success: "創建完成！",
          error: "創建失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then((res) => {
        navigate(`/template/${res.data.id}`);
      });
  }, [createTemplateAsyncFn, googleDriveTemplatesFolderId, navigate]);

  const handleClickUploadTemplate = useCallback(async () => {
    const file = await pickFile();
    const uploadedTemplate = await readJsonFromFile<BahaTemplate>(file);
    const jsonValidateResult = await validateJson(
      uploadedTemplate,
      "/json-schema/template-v1.schema.json"
    );

    if (!jsonValidateResult.valid) {
      toast.error(
        "上傳的檔案格式有誤，請檢查檔案內容。詳細錯誤請打開 F12 主控台查看。"
      );
      console.error(jsonValidateResult.errors);
      return;
    }

    toast
      .promise(
        createTemplateAsyncFn(
          uploadedTemplate,
          `${uploadedTemplate.properties.name}.json`,
          googleDriveTemplatesFolderId
        ),
        {
          loading: "上傳模板中……",
          success: "上傳完成！",
          error: "上傳失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
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
                  loading={isCreatingSheet}
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
                  <th>作者</th>
                  <th>最後更新日期</th>
                  <th>
                    <p className="text-right">操作</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {sheets?.files.map((item) => (
                  <tr key={item.id}>
                    <td>{item.properties.name}</td>
                    <td>{item.properties.author}</td>
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
            {!isLoadingSheets && sheets?.files.length === 0 && (
              <div className="text-center py-16 bg-neutral-100 dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300">
                沒有角色卡
              </div>
            )}
            {isLoadingSheets && (
              <div className="text-center py-16 bg-neutral-100 dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300">
                讀取中...
              </div>
            )}
          </section>

          <section className="space-y-2">
            <div className="flex justify-between">
              <h1 className="text-2xl bold">你的自定義模板</h1>
              <div className="text-right space-x-2">
                <Button
                  size="lg"
                  variant="soft"
                  color="primary"
                  onClick={handleClickUploadTemplate}
                  loading={isCreatingTemplate}
                >
                  上傳模板 (.json)
                </Button>
                <Button
                  size="lg"
                  variant="solid"
                  color="success"
                  onClick={handleClickCreateTemplate}
                  loading={isCreatingTemplate}
                >
                  創建新的模板
                </Button>
              </div>
            </div>

            <Table>
              <thead>
                <tr>
                  <th>名稱</th>
                  <th>作者</th>
                  <th>最後更新日期</th>
                  <th>
                    <p className="text-right">操作</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {templates?.files.map((item) => (
                  <tr key={item.id}>
                    <td>{item.properties.name}</td>
                    <td>{item.properties.author}</td>
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
            {!isLoadingTemplates && templates?.files.length === 0 && (
              <div className="text-center py-16 bg-neutral-100 dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300">
                沒有自定義的模板
              </div>
            )}
            {isLoadingTemplates && (
              <div className="text-center py-16 bg-neutral-100 dark:bg-neutral-900 text-sm text-neutral-700 dark:text-neutral-300">
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
