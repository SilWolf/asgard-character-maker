/* eslint-disable no-irregular-whitespace */
import { useCallback, useMemo, useState } from "react";
import BahaCode from "@/components/BahaCode";
import { Alert, Breadcrumbs, Button, Tab, TabList, Tabs } from "@mui/joy";
import toast from "react-hot-toast";
import SheetDetailSingle from "./single.subpage";
import {
  getFileByIdAsJSON,
  patchFileWithJsonObject,
} from "@/helpers/google-drive.helper";
import { useAsyncFn, useEffectOnce, useToggle } from "react-use";
import { Link, useParams, unstable_usePrompt } from "react-router-dom";
import { SheetNewSingle } from "./new-single.subpage";
import { Sheet, SheetSection, SheetTemplate } from "@/types/Sheet.type";
import { BahaTemplate } from "@/types/Baha.type";
import SheetDetailConfigAndExportSubPage from "./config-and-export.subpage";
import PublicLayout from "@/layouts/public.layout";
import { ErrorBoundary } from "react-error-boundary";
import SheetDetailLayoutAndSectionsSubPage from "./layout-and-sections.subpage";
import { utilGetUniqueId } from "@/utils/string.util";

const SheetDetailPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const [sheet, setSheet] = useState<Sheet | undefined>(undefined);

  const [dirty, toggleDirty] = useToggle(false);
  const usePromptOptions = useMemo(
    () => ({
      when: dirty,
      message: "你可能有未儲存的修改，確定要離開嗎？",
    }),
    [dirty]
  );
  // useBeforeUnload(dirty, "你可能有未儲存的修改，確定要離開嗎？");
  unstable_usePrompt(usePromptOptions);

  useEffectOnce(() => {
    if (!sheetId) {
      return;
    }

    getFileByIdAsJSON<Sheet>(sheetId).then(setSheet);
  });

  const [{ loading: isSaving }, saveAsyncFn] = useAsyncFn(
    patchFileWithJsonObject
  );
  const handleClickSave = useCallback(() => {
    if (!sheet) {
      return;
    }
    toast
      .promise(
        saveAsyncFn(sheetId as string, sheet, `${sheet.properties.name}.json`),
        {
          loading: "儲存中...",
          success: "儲存完成",
          error: "儲存失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      )
      .then(() => {
        toggleDirty(false);
      });
  }, [saveAsyncFn, sheet, sheetId, toggleDirty]);

  const [activeTab, setActiveTab] = useState<string>("0");
  const handleChangeTab = useCallback(
    (_: unknown, newValue: string | number | null) => {
      setActiveTab(newValue as string);
    },
    []
  );

  const handleSubmitNewLayout = useCallback(
    (newLayout: Sheet["layout"], fullRefresh?: boolean) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }

        const newPrev = {
          ...prev,
          layout: newLayout,
        };

        if (fullRefresh) {
          const sectionIds = [];
          const templateIds = [];

          for (const row of newPrev.layout) {
            for (const col of row.cols) {
              for (const sectionId of col.sectionIds) {
                const section = newPrev.sectionsMap[sectionId];
                if (section) {
                  sectionIds.push(section.id);
                  templateIds.push(section.templateId);
                }
              }
            }
          }

          newPrev.sectionsMap = sectionIds.reduce<Record<string, SheetSection>>(
            (obj, curr) => {
              obj[curr] = prev.sectionsMap[curr];
              return obj;
            },
            {}
          );
          newPrev.templatesMap = templateIds.reduce<
            Record<string, SheetTemplate>
          >((obj, curr) => {
            obj[curr] = prev.templatesMap[curr];
            return obj;
          }, {});
        }

        return newPrev;
      });
    },
    []
  );

  const handleSubmitSingle = useCallback(
    (sectionId: string, newValue: Record<string, string>) => {
      setSheet((prev) => {
        if (!prev || !prev.sectionsMap[sectionId]) {
          return prev;
        }

        return {
          ...prev,
          sectionsMap: {
            ...prev.sectionsMap,
            [sectionId]: {
              ...prev.sectionsMap[sectionId],
              value: [newValue],
            },
          },
        };
      });
      toggleDirty(true);
    },
    [toggleDirty]
  );

  const handleSubmitNewSection = useCallback(
    async (newSingle: SheetNewSingle) => {
      return toast.promise(
        getFileByIdAsJSON<BahaTemplate>(newSingle.templateId).then(
          (template) => {
            setSheet((prev) => {
              if (!prev) {
                return prev;
              }

              return {
                ...prev,
                templatesMap: {
                  ...prev.templatesMap,
                  [newSingle.templateId]: {
                    bahaCode: template.bahaCode,
                    props: template.props,
                    name: template.properties.name,
                  },
                },
                sectionsMap: {
                  ...prev.sectionsMap,
                  [newSingle.id]: {
                    id: newSingle.id,
                    name: newSingle.name,
                    templateId: newSingle.templateId,
                    value: [{}],
                  },
                },
                layout: [
                  ...prev.layout,
                  {
                    id: `row_${utilGetUniqueId()}`,
                    cols: [
                      {
                        id: `col_${utilGetUniqueId()}`,
                        width: "100%",
                        sectionIds: [newSingle.id],
                      },
                    ],
                  },
                ],
              };
            });
            setActiveTab(newSingle.id);

            toggleDirty(true);
          }
        ),
        {
          loading: (
            <span>
              正在創建區塊 <span className="bold">{newSingle.name}</span>
            </span>
          ),
          success: "已成功創建",
          error: "創建失敗，下載模版失敗",
        }
      );
    },
    [toggleDirty]
  );

  const handleEditSection = useCallback(
    (sectionId: string, newSection: SheetSection) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          sectionsMap: {
            ...prev.sectionsMap,
            [sectionId]: newSection,
          },
        };
      });
      toggleDirty(true);
    },
    [toggleDirty]
  );

  const handleSubmitConfig = useCallback(
    (newValue: Sheet["properties"]) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          properties: {
            ...prev.properties,
            ...newValue,
          },
        };
      });

      toggleDirty(true);
    },
    [toggleDirty]
  );

  const sheetSections = useMemo(() => {
    if (!sheet) {
      return [];
    }

    const sectionIds = [];
    for (const row of sheet.layout) {
      for (const col of row.cols) {
        sectionIds.push(...col.sectionIds);
      }
    }

    return sectionIds.map((sectionId) => sheet.sectionsMap[sectionId]);
  }, [sheet]);

  const [bahaCodePreviewClassName, setBahaCodePreviewClassName] =
    useState<string>("baha-preview");

  const handleChangePreview = useCallback(
    (_: unknown, newTab: string | number | null) =>
      setBahaCodePreviewClassName(newTab as string),
    []
  );

  const [bahaCodeLightOrDarkClassName, setBahaCodeLightOrDarkClassName] =
    useState<string>("baha-preview-light");

  const handleChangeLightOrDark = useCallback(
    (_: unknown, newTab: string | number | null) =>
      setBahaCodeLightOrDarkClassName(newTab as string),
    []
  );

  if (!sheet || !sheetId) {
    return <PublicLayout />;
  }

  return (
    <PublicLayout>
      <header id="header" className="space-y-4">
        <div className="container mx-auto">
          <Breadcrumbs aria-label="breadcrumbs">
            <Link to="/">主頁</Link>
            <span>角色卡</span>
            <span>{sheet.properties.name}</span>
          </Breadcrumbs>
        </div>
        <div className="container mx-auto flex flex-row gap-x-4">
          <div className="shrink-0">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="0" variant="plain" color="neutral">
                  總覽
                </Tab>
                <Tab
                  value="layout-and-sections"
                  variant="plain"
                  color="neutral"
                >
                  區塊＆佈局
                </Tab>
              </TabList>
            </Tabs>
          </div>
          <div className="flex-1">
            <div>
              <Tabs value={activeTab} onChange={handleChangeTab}>
                <TabList>
                  {sheetSections.map((section) => (
                    <Tab
                      key={section.id}
                      value={section.id}
                      variant="plain"
                      color="neutral"
                    >
                      {section.name}
                    </Tab>
                  ))}
                  <Tab value="+" variant="plain" color="neutral">
                    +
                  </Tab>
                </TabList>
              </Tabs>
            </div>
          </div>
          <div className="shrink-0">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="configAndExport" variant="plain" color="neutral">
                  設定＆匯出
                </Tab>
              </TabList>
            </Tabs>
          </div>
          <div className="shrink-0 space-x-2">
            <Button
              color="success"
              onClick={handleClickSave}
              loading={isSaving}
            >
              儲存
            </Button>
          </div>
        </div>
      </header>
      <div className="mt-4">
        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "0" ? "1" : "0"}
        >
          <div className="container mx-auto mb-2 space-x-2">
            <div className="inline-block">
              <Tabs
                size="sm"
                value={bahaCodePreviewClassName}
                onChange={handleChangePreview}
              >
                <TabList disableUnderline>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview"
                  >
                    新版小屋
                  </Tab>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview-old-home"
                  >
                    舊版小屋
                  </Tab>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview-wiki"
                  >
                    Wiki
                  </Tab>
                </TabList>
              </Tabs>
            </div>

            <div className="inline-block">
              <Tabs
                size="sm"
                value={bahaCodeLightOrDarkClassName}
                onChange={handleChangeLightOrDark}
              >
                <TabList disableUnderline>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview-light"
                  >
                    <i className="uil uil-sun"></i>
                  </Tab>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview-dark"
                  >
                    <i className="uil uil-moon"></i>
                  </Tab>
                </TabList>
              </Tabs>
            </div>
          </div>

          <div
            className={`mx-auto container py-4 ${bahaCodeLightOrDarkClassName}`}
          >
            <div className={bahaCodePreviewClassName}>
              {sheetSections.map((section) => (
                <BahaCode
                  key={section.id}
                  code={sheet.templatesMap[section.templateId].bahaCode}
                  template={sheet.templatesMap[section.templateId]}
                  values={section.value[0]}
                />
              ))}
            </div>
          </div>
        </section>

        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "layout-and-sections" ? "1" : "0"}
        >
          <SheetDetailLayoutAndSectionsSubPage
            sheet={sheet}
            onSubmitSection={handleSubmitNewSection}
            onSubmitLayout={handleSubmitNewLayout}
            onEditSection={handleEditSection}
          />
        </section>

        {sheetSections.map((section) => (
          <section
            key={section.id}
            className="hidden data-[active='1']:block"
            data-active={activeTab === section.id ? "1" : "0"}
          >
            <div className="h-[calc(100vh-320px)]">
              <ErrorBoundary
                fallbackRender={() => (
                  <Alert color="danger">
                    在輸出畫面時出現錯誤，有可能檔案格式不對而導致。請在“設定＆匯出“頁面中下載備份、嘗試修復後再上傳，或是直接刪除此檔案。
                  </Alert>
                )}
              >
                <SheetDetailSingle
                  sectionId={section.id}
                  template={sheet.templatesMap[section.templateId]}
                  value={section.value[0]}
                  submitFlag={activeTab !== section.id}
                  onSubmit={handleSubmitSingle}
                />
              </ErrorBoundary>
            </div>
          </section>
        ))}

        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "configAndExport" ? "1" : "0"}
        >
          <SheetDetailConfigAndExportSubPage
            sheet={sheet}
            onSubmit={handleSubmitConfig}
            sheetId={sheetId}
          />
        </section>
      </div>
    </PublicLayout>
  );
};

export default SheetDetailPage;
