/* eslint-disable no-irregular-whitespace */
import { useCallback, useMemo, useState } from "react";
import BahaCode from "@/components/BahaCode";
import { Alert, Breadcrumbs, Button, Tab, TabList, Tabs } from "@mui/joy";
import toast from "react-hot-toast";
import SheetDetailSingle from "./single.subpage";
import {
  getFileByIdAsJSON,
  patchFileProperties,
  patchFileWithJsonObject,
} from "@/helpers/google-drive.helper";
import { useAsyncFn, useEffectOnce, useToggle } from "react-use";
import { Link, useParams, unstable_usePrompt } from "react-router-dom";
import {
  Sheet,
  SheetProperties,
  SheetSection,
  SheetTemplate,
} from "@/types/Sheet.type";
import { BahaTemplate } from "@/types/Baha.type";
import SheetDetailConfigAndExportSubPage from "./config-and-export.subpage";
import PublicLayout from "@/layouts/public.layout";
import { ErrorBoundary } from "react-error-boundary";
import SheetDetailLayoutAndSectionsSubPage from "./layout-and-sections.subpage";
import { utilGetUniqueId } from "@/utils/string.util";
import SheetDetailErrorSubpage from "./error.subpage";
import { validateJson } from "@/utils/json.util";

const SheetDetailPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const [sheet, setSheet] = useState<Sheet | undefined>(undefined);
  const [pageError, setPageError] = useState<unknown>();

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

    getFileByIdAsJSON<Sheet>(sheetId).then(async (fetchedTemplate) => {
      const jsonValidateResult = await validateJson(
        fetchedTemplate,
        "/json-schema/sheet-v1.schema.json"
      );

      if (jsonValidateResult.errors) {
        setPageError(jsonValidateResult.errors);
      }

      setSheet(fetchedTemplate);
    });
  });

  const [{ loading: isSaving }, saveAsyncFn] = useAsyncFn(
    (newSheet: Sheet, newName: string) =>
      patchFileWithJsonObject(
        sheetId as string,
        newSheet,
        `${newName}.json`
      ).then(() => patchFileProperties(sheetId as string, newSheet.properties)),
    [sheet, sheetId]
  );
  const handleClickSave = useCallback(() => {
    if (!sheet) {
      return;
    }

    toast
      .promise(saveAsyncFn(sheet, sheet.properties.name), {
        loading: "儲存中...",
        success: "儲存完成",
        error: "儲存失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
      })
      .then(() => {
        toggleDirty(false);
      });
  }, [saveAsyncFn, sheet, toggleDirty]);

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

  const handleSubmitSectionValue = useCallback(
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

  const handleSubmitProperties = useCallback(
    (newProperties: SheetProperties) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          properties: newProperties,
        };
      });
      toggleDirty(true);
    },
    [toggleDirty]
  );

  const handleSubmitSection = useCallback(
    async (
      newSection: Pick<SheetSection, "id" | "name" | "templateId"> &
        Partial<Pick<SheetSection, "value">>
    ) => {
      const fetchedTemplate = sheet?.templatesMap[newSection.templateId]
        ? Promise.resolve(sheet.templatesMap[newSection.templateId])
        : await getFileByIdAsJSON<BahaTemplate>(newSection.templateId).then(
            (template): SheetTemplate => ({
              bahaCode: template.bahaCode,
              props: template.props,
              name: template.properties.name,
            })
          );

      if (!fetchedTemplate) {
        return;
      }

      return toast.promise(
        (sheet?.templatesMap[newSection.templateId]
          ? Promise.resolve(sheet.templatesMap[newSection.templateId])
          : getFileByIdAsJSON<BahaTemplate>(newSection.templateId).then(
              (template): SheetTemplate => ({
                bahaCode: template.bahaCode,
                props: template.props,
                name: template.properties.name,
              })
            )
        ).then((template) => {
          setSheet((prev) => {
            if (!prev) {
              return prev;
            }

            return {
              ...prev,
              templatesMap: {
                ...prev.templatesMap,
                [newSection.templateId]: template,
              },
              sectionsMap: {
                ...prev.sectionsMap,
                [newSection.id]: {
                  id: newSection.id,
                  name: newSection.name,
                  templateId: newSection.templateId,
                  value: newSection.value ??
                    prev.sectionsMap[newSection.id]?.value ?? [{}],
                },
              },
              layout: [
                ...prev.layout,
                ...(!prev.sectionsMap[newSection.id]
                  ? [
                      {
                        id: `row_${utilGetUniqueId()}`,
                        cols: [
                          {
                            id: `col_${utilGetUniqueId()}`,
                            width: "100%",
                            sectionIds: [newSection.id],
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            };
          });
          // setActiveTab(newSection.id);

          toggleDirty(true);
        }),
        {
          loading: (
            <span>
              正在創建區塊 <span className="bold">{newSection.name}</span>
            </span>
          ),
          success: "已成功創建",
          error: "創建失敗，下載模板失敗",
        }
      );
    },
    [sheet?.templatesMap, toggleDirty]
  );

  const handleSubmitTemplate = useCallback(
    (newTemplate: SheetTemplate & { id: string }) => {
      const { id, ...template } = newTemplate;

      setSheet((prev) => {
        if (!prev) {
          return;
        }

        return {
          ...prev,
          templatesMap: {
            ...prev.templatesMap,
            [id]: {
              ...prev.templatesMap[id],
              ...template,
            },
          },
        };
      });
      toggleDirty(true);

      return Promise.resolve();
    },
    [toggleDirty]
  );

  const handleSubmitConfig = useCallback(
    (newValue: Pick<Sheet, "properties" | "detailProperties">) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          ...newValue,
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
      if (!row.hidden) {
        for (const col of row.cols) {
          sectionIds.push(...col.sectionIds);
        }
      }
    }

    return sectionIds.map((sectionId) => sheet.sectionsMap[sectionId]);
  }, [sheet]);

  const handleChangePreview = useCallback(
    (_: unknown, newValue: string | number | null) =>
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          properties: {
            ...prev.properties,
            previewMode: newValue as SheetProperties["previewMode"],
          },
        };
      }),
    []
  );

  const handleChangeViewMode = useCallback(
    (_: unknown, newValue: string | number | null) =>
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }

        return {
          ...prev,
          properties: {
            ...prev.properties,
            viewMode: newValue as SheetProperties["viewMode"],
          },
        };
      }),
    []
  );

  if (!sheet || !sheetId) {
    return <PublicLayout />;
  }

  if (pageError) {
    return (
      <PublicLayout>
        <SheetDetailErrorSubpage
          sheet={sheet}
          sheetId={sheetId}
          error={pageError}
        />
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <header id="header" className="space-y-4">
        <div className="container mx-auto">
          <Breadcrumbs aria-label="breadcrumbs">
            <Link
              to="/"
              className="text-neutral-800 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-300 no-underline"
            >
              主頁
            </Link>
            <span>角色卡</span>
            <span>{sheet.properties.name}</span>
          </Breadcrumbs>
        </div>
        <div className="container mx-auto flex flex-row gap-x-4">
          <div className="shrink-0">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="0" variant="plain" color="primary">
                  總覽
                </Tab>
                <Tab
                  value="layout-and-sections"
                  variant="plain"
                  color="primary"
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
                </TabList>
              </Tabs>
            </div>
          </div>
          <div className="shrink-0">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="configAndExport" variant="plain" color="primary">
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
                value={sheet.properties.previewMode}
                onChange={handleChangePreview}
              >
                <TabList disableUnderline>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="baha-preview-new-home"
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
                value={sheet.properties.viewMode}
                onChange={handleChangeViewMode}
              >
                <TabList disableUnderline>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="light"
                  >
                    <i className="uil uil-sun"></i>
                  </Tab>
                  <Tab
                    variant="outlined"
                    color="neutral"
                    disableIndicator
                    indicatorInset
                    value="dark"
                  >
                    <i className="uil uil-moon"></i>
                  </Tab>
                </TabList>
              </Tabs>
            </div>
          </div>

          <div
            className={`mx-auto container py-4 baha-preview-${sheet.properties.viewMode}`}
          >
            <div className={sheet.properties.previewMode}>
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
            onSubmitSection={handleSubmitSection}
            onSubmitLayout={handleSubmitNewLayout}
            onSubmitTemplate={handleSubmitTemplate}
          />
        </section>

        {sheetSections.map((section) => (
          <section
            key={section.id}
            className="hidden data-[active='1']:block"
            data-active={activeTab === section.id ? "1" : "0"}
          >
            <div className="h-[calc(100vh-210px)]">
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
                  properties={sheet.properties}
                  submitFlag={activeTab !== section.id}
                  onSubmitValue={handleSubmitSectionValue}
                  onSubmitProperties={handleSubmitProperties}
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
