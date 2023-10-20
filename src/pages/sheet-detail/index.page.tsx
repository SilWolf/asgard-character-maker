/* eslint-disable no-irregular-whitespace */
import { useCallback, useState } from "react";
import BahaCode, { BahaTemplate } from "@/components/BahaCode";
import { Breadcrumbs, Button, Tab, TabList, Tabs } from "@mui/joy";
import toast from "react-hot-toast";
import SheetDetailSingle from "./single.subpage";
import {
  getFileByIdAsJSON,
  patchFileWithJsonObject,
} from "@/helpers/google-drive.helper";
import { useAsyncFn, useEffectOnce } from "react-use";
import { Link, useParams } from "wouter";
import SheetDetailNewSingleSubPage, {
  SheetNewSingle,
} from "./new-single.subpage";

type Sheet = {
  slug: string;
  name: string;
  author: string;
  sections: SheetSection[];
};

type SheetSection = {
  id: string;
  name: string;
  template: BahaTemplate;
  value: Record<string, string>;
};

const SheetDetailPage = () => {
  const { sheetId } = useParams<{ sheetId: string }>();
  const [sheet, setSheet] = useState<Sheet | undefined>(undefined);

  useEffectOnce(() => {
    if (!sheetId) {
      return;
    }

    getFileByIdAsJSON<Sheet>(sheetId).then(setSheet);
  });

  const handleClickExport = useCallback(() => {
    if (!sheet) {
      return;
    }

    const finalBahaCode = sheet.sections
      .map(({ template, value }) => {
        const props = [
          ...template.textProps,
          ...template.systemTextProps,
          ...template.imageProps,
          ...template.colorProps,
        ];

        let replacedCode = template.bahaCode;

        for (const prop of props) {
          replacedCode = replacedCode.replace(
            new RegExp(`\\$${prop.id}\\$`, "g"),
            value[prop.id] || prop.defaultValue
          );
        }

        return replacedCode;
      })
      .join("\n");

    const filename = `asgard character - ${new Date().toISOString()}.txt`;

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(finalBahaCode)
    );
    element.setAttribute("download", filename);
    element.click();
  }, [sheet]);

  const [{ loading: isSaving }, saveAsyncFn] = useAsyncFn(
    patchFileWithJsonObject
  );
  const handleClickSave = useCallback(() => {
    if (!sheet) {
      return;
    }
    toast.promise(saveAsyncFn(sheetId, sheet), {
      loading: "儲存中...",
      success: "儲存完成",
      error: "儲存失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
    });
  }, [saveAsyncFn, sheet, sheetId]);

  const [activeTab, setActiveTab] = useState<string>("0");
  const handleChangeTab = useCallback(
    (_: unknown, newValue: string | number | null) => {
      setActiveTab(newValue as string);
    },
    []
  );

  const handleSubmitSingle = useCallback(
    (sectionId: string, newValue: Record<string, string>) => {
      setSheet((prev) => {
        if (!prev) {
          return prev;
        }

        const index = prev.sections.findIndex(({ id }) => sectionId === id);
        if (index === -1) {
          return prev;
        }

        const section = prev.sections[index];

        return {
          ...prev,
          sections: prev.sections.splice(index, 1, {
            ...section,
            value: newValue,
          }),
        };
      });
    },
    []
  );

  const handleSubmitNewSingle = useCallback(
    async (newSingle: SheetNewSingle) => {
      return toast
        .promise(getFileByIdAsJSON<BahaTemplate>(newSingle.templateId), {
          loading: (
            <span>
              正在創建區塊 <span className="bold">{newSingle.name}</span>
            </span>
          ),
          success: "已成功創建",
          error: "創建失敗，下載模版失敗",
        })
        .then((template) => {
          setSheet((prev) => {
            if (!prev) {
              return prev;
            }

            return {
              ...prev,
              sections: [
                ...prev.sections,
                {
                  id: newSingle.id,
                  slug: newSingle.id,
                  name: newSingle.name,
                  template,
                  value: {},
                },
              ],
            };
          });

          setActiveTab(newSingle.id);
        });
    },
    []
  );

  if (!sheet) {
    return <></>;
  }

  return (
    <>
      <header id="header" className="pt-4 space-y-4">
        <div className="container mx-auto">
          <Breadcrumbs aria-label="breadcrumbs">
            <Link to="/">主頁</Link>
            <span>{sheet.name}</span>
          </Breadcrumbs>
        </div>
        <div className="container mx-auto flex flex-row gap-x-4">
          <div className="shrink-0">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="0" variant="plain" color="neutral">
                  總覽
                </Tab>
              </TabList>
            </Tabs>
          </div>
          <div className="flex-1">
            <div>
              <Tabs value={activeTab} onChange={handleChangeTab}>
                <TabList>
                  {sheet.sections.map((section) => (
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
          <div className="shrink-0 space-x-2">
            <Button
              color="neutral"
              variant="outlined"
              onClick={handleClickExport}
            >
              匯出巴哈創作原始碼
            </Button>
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
          <div className="mx-auto container py-4">
            <div className="baha-preview">
              {sheet.sections.map((section) => (
                <BahaCode
                  key={section.id}
                  code={section.template.bahaCode}
                  template={section.template}
                  values={section.value}
                />
              ))}
            </div>
          </div>
        </section>

        {sheet.sections.map((section) => (
          <section
            key={section.id}
            className="hidden data-[active='1']:block"
            data-active={activeTab === section.id ? "1" : "0"}
          >
            <div className="mx-auto container flex flex-row gap-x-4 h-[calc(100vh-80px)] py-4">
              <SheetDetailSingle
                sectionId={section.id}
                template={section.template}
                value={section.value}
                submitFlag={activeTab !== section.id}
                onSubmit={handleSubmitSingle}
              />
            </div>
          </section>
        ))}

        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "+" ? "1" : "0"}
        >
          <SheetDetailNewSingleSubPage
            sectionsCount={sheet.sections.length}
            onSubmit={handleSubmitNewSingle}
          />
        </section>
      </div>
    </>
  );
};

export default SheetDetailPage;