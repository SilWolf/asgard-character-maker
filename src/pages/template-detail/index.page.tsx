import {
  getFileByIdAsJSON,
  patchFileWithJsonObject,
} from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplate } from "@/types/Baha.type";
import { Breadcrumbs, Button, Tab, TabList, Tabs } from "@mui/joy";
import { useCallback, useMemo, useState } from "react";
import { Link, unstable_usePrompt, useParams } from "react-router-dom";
import { useAsyncFn, useEffectOnce, useToggle } from "react-use";
import TemplateDetailPropsSubPage from "./props.subpage";
import TemplateDetailBahaCodeSubPage from "./bahaCode.subpage";
import toast from "react-hot-toast";
import TemplateDetailConfigAndExportSubPage from "./config-and-export.subpage";
import { validateJson } from "@/utils/json.util";
import TemplateDetailErrorSubpage from "./error.subpage";

const TemplateCreatePage = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const [template, setTemplate] = useState<BahaTemplate | undefined>(undefined);
  const [pageError, setPageError] = useState<unknown>();

  const [dirty, toggleDirty] = useToggle(false);
  const usePromptOptions = useMemo(
    () => ({
      when: dirty,
      message: "你可能有未儲存的修改，確定要離開嗎？",
    }),
    [dirty]
  );
  unstable_usePrompt(usePromptOptions);

  const handleSubmitBahaCode = useCallback(
    (newBahaCode: string) => {
      setTemplate((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          bahaCode: newBahaCode,
        };
      });

      toggleDirty(true);
    },
    [toggleDirty]
  );

  const handleSubmitProps = useCallback(
    (newProps: BahaTemplate["props"]) => {
      setTemplate((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          props: newProps,
        };
      });

      toggleDirty(true);
    },
    [toggleDirty]
  );

  const handleSubmitConfig = useCallback(
    (newValue: BahaTemplate["properties"]) => {
      setTemplate((prev) => {
        if (!prev) {
          return prev;
        }
        return {
          ...prev,
          properties: {
            ...newValue,
          },
        };
      });

      toggleDirty(true);
    },
    [toggleDirty]
  );

  const [activeTab, setActiveTab] = useState<string>("0");
  const handleChangeTab = useCallback(
    (_: unknown, newValue: string | number | null) => {
      setActiveTab(newValue as string);
    },
    []
  );

  const [{ loading: isSaving }, saveAsyncFn] = useAsyncFn(
    patchFileWithJsonObject
  );
  const handleClickSave = useCallback(() => {
    if (!template) {
      return;
    }

    const newName = [
      template.properties.name,
      template.properties.author,
      template.properties.briefing,
      template.properties.tags,
      template.properties.suitableForOldHome ? "[O]" : undefined,
      template.properties.suitableForNewHome ? "[N]" : undefined,
      template.properties.suitableForWiki ? "[W]" : undefined,
      template.properties.suitableForLightMode ? "[L]" : undefined,
      template.properties.suitableForDarkMode ? "[D]" : undefined,
    ]
      .filter((item) => !!item)
      .join(",");

    toast
      .promise(saveAsyncFn(templateId as string, template, `${newName}.json`), {
        loading: "儲存中...",
        success: "儲存完成",
        error: "儲存失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
      })
      .then(() => {
        toggleDirty(false);
      });
  }, [saveAsyncFn, template, templateId, toggleDirty]);

  useEffectOnce(() => {
    if (!templateId) {
      return;
    }

    getFileByIdAsJSON<BahaTemplate>(templateId).then(
      async (fetchedTemplate) => {
        const jsonValidateResult = await validateJson(
          fetchedTemplate,
          "/json-schema/template-v1.schema.json"
        );

        if (jsonValidateResult.errors) {
          setPageError(jsonValidateResult.errors);
        }

        setTemplate(fetchedTemplate);
      }
    );
  });

  if (!template || !templateId) {
    return <PublicLayout></PublicLayout>;
  }

  if (pageError) {
    return (
      <PublicLayout>
        <TemplateDetailErrorSubpage
          template={template}
          templateId={templateId}
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
            <span>模板</span>
            <span>{template.properties.name}</span>
          </Breadcrumbs>
        </div>
        <div className="container mx-auto flex gap-x-4">
          <div className="flex-1">
            <Tabs value={activeTab} onChange={handleChangeTab}>
              <TabList>
                <Tab value="0" variant="plain" color="neutral">
                  原始碼
                </Tab>
                <Tab value="1" variant="plain" color="neutral">
                  預覽＆欄位
                </Tab>
                <Tab value="2" variant="plain" color="neutral">
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
      <div className="space-y-6">
        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "0" ? "1" : "0"}
        >
          <TemplateDetailBahaCodeSubPage
            template={template}
            onSubmit={handleSubmitBahaCode}
          />
        </section>

        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "1" ? "1" : "0"}
        >
          <div className="h-[calc(100vh-320px)]">
            <TemplateDetailPropsSubPage
              template={template}
              onSubmit={handleSubmitProps}
            />
          </div>
        </section>

        <section
          className="hidden data-[active='1']:block"
          data-active={activeTab === "2" ? "1" : "0"}
        >
          <TemplateDetailConfigAndExportSubPage
            template={template}
            onSubmit={handleSubmitConfig}
            templateId={templateId}
          />
        </section>
      </div>
    </PublicLayout>
  );
};

export default TemplateCreatePage;
