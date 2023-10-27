import MarketplaceItemCard from "@/components/MarketplaceItemCard";
import {
  GoogleDriveFile,
  getFilesByFolderId,
  getPublicFileByIdAsJSON,
  patchFileProperties,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplate, BahaTemplateProperties } from "@/types/Baha.type";
import { Button, Checkbox, FormControl, FormLabel, Input } from "@mui/joy";
import {
  QueryFunction,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

const fetchMarketplaceItems: QueryFunction<
  { files: GoogleDriveFile[]; nextPageToken: string | null },
  string[],
  string | null
> = ({ queryKey }) =>
  getFilesByFolderId(import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID, {
    isPublic: true,
    rawFilter: queryKey[1],
  });

const MarketplacePage = () => {
  const { setting } = useGoogleAuth();
  const [rawFilter, setRawFilter] = useState<string>("");

  const {
    data,
    isFetching: isSearching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["marketplace", rawFilter],
    queryFn: fetchMarketplaceItems,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    placeholderData: keepPreviousData,
  });

  const handleClickSubmitFolder = useCallback((e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const formJson = Object.fromEntries(formData.entries()) as {
      search: string;
      suitableForNewHome: string;
      suitableForOldHome: string;
      suitableForWiki: string;
      suitableForLightMode: string;
      suitableForDarkMode: string;
    };

    const newRawFilters: string[] = [];
    const optionalFilters: string[] = [];

    if (formJson.search) {
      newRawFilters.push(`name contains '${formJson.search}'`);
    }

    if (formJson.suitableForNewHome) {
      optionalFilters.push(`name contains '[N]'`);
    }
    if (formJson.suitableForOldHome) {
      optionalFilters.push(`name contains '[O]'`);
    }
    if (formJson.suitableForWiki) {
      optionalFilters.push(`name contains '[W]'`);
    }
    if (formJson.suitableForLightMode) {
      optionalFilters.push(`name contains '[L]'`);
    }
    if (formJson.suitableForDarkMode) {
      optionalFilters.push(`name contains '[D]'`);
    }

    if (optionalFilters.length > 0) {
      newRawFilters.push(`(${optionalFilters.join(" or ")})`);
    }

    setRawFilter(newRawFilters.join(" and "));
  }, []);

  const handleClickDownload = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const templateId = e.currentTarget.getAttribute("data-id");
      if (!templateId) {
        return Promise.resolve();
      }

      return toast.promise(
        getPublicFileByIdAsJSON<BahaTemplate>(templateId).then((template) => {
          return postUploadJsonObjectAsFile(
            template,
            `${template.properties.name}.json`,
            setting?.templatesFolderId
          ).then((res) =>
            patchFileProperties(res.data.id, {
              name: template.properties.name,
              author: template.properties.author,
              briefing: template.properties.briefing,
              demoUrl: template.properties.demoUrl,
              previewImageUrl: template.properties.previewImageUrl,
              tags: template.properties.tags,
              suitableForNewHome: template.properties.suitableForNewHome
                ? "1"
                : null,
              suitableForOldHome: template.properties.suitableForOldHome
                ? "1"
                : null,
              suitableForWiki: template.properties.suitableForWiki ? "1" : null,
              suitableForLightMode: template.properties.suitableForLightMode
                ? "1"
                : null,
              suitableForDarkMode: template.properties.suitableForDarkMode
                ? "1"
                : null,
            })
          );
        }),
        {
          loading: "正在下載模板，這可能需要一點時間……",
          success: "下載成功！你可在自定義模板中找到它。",
          error: "下載失敗，請重試。",
        }
      );
    },
    [setting?.templatesFolderId]
  );

  return (
    <PublicLayout>
      <div className="space-y-6">
        <section className="container mx-auto max-w-screen-md space-y-2">
          <h1 className="text-3xl">模板市場</h1>
          <p>
            這裡收錄了眾多模板以供複製使用，推薦初次到來的玩家，從這裡挑選心宜的模板來製作你的角色卡。
          </p>
        </section>

        <section className="container mx-auto max-w-screen-md">
          <form onSubmit={handleClickSubmitFolder}>
            <div className="bg-neutral-100 rounded py-4 px-8 space-y-4">
              <FormControl>
                <FormLabel>搜索</FormLabel>
                <Input
                  startDecorator={<i className="uil uil-search" />}
                  placeholder="模板名稱 / 作者 / 簡介 / 標籤"
                  name="search"
                />
              </FormControl>

              <div className="flex items-end">
                <div className="flex-1">
                  <FormLabel>條件</FormLabel>
                  <div className="space-x-4">
                    <Checkbox
                      label="適合新版小屋"
                      defaultChecked
                      value="1"
                      name="suitableForNewHome"
                    />
                    <Checkbox
                      label="適合舊版小屋"
                      defaultChecked
                      value="1"
                      name="suitableForOldHome"
                    />
                    <Checkbox
                      label="適合Wiki"
                      defaultChecked
                      value="1"
                      name="suitableForWiki"
                    />
                  </div>
                  <div className="space-x-4">
                    <Checkbox
                      label="適合明亮模式"
                      defaultChecked
                      value="1"
                      name="suitableForLightMode"
                    />
                    <Checkbox
                      label="適合黑闇模式"
                      defaultChecked
                      value="1"
                      name="suitableForDarkMode"
                    />
                  </div>
                </div>
                <div className="shrink-0">
                  <Button type="submit" color="success" loading={isSearching}>
                    <i className="uil uil-search mr-1"></i>搜索
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </section>

        <section className="container mx-auto grid grid-cols-4 gap-4">
          {data?.pages.map((page) =>
            page.files.map((item) => (
              <div key={item.id}>
                <div className="shadow bg-white dark:bg-neutral-800 shadow-neutral-400 dark:shadow-neutral-600 p-4 rounded">
                  <MarketplaceItemCard
                    templateId={item.id}
                    properties={
                      item.properties as unknown as BahaTemplateProperties
                    }
                    onClickDownload={handleClickDownload}
                    detailTo={`/marketplace/${item.id}`}
                  />
                </div>
              </div>
            ))
          )}
        </section>

        {isFetchingNextPage && <p className="text-center">讀取更多結果中……</p>}
      </div>
    </PublicLayout>
  );
};

export default MarketplacePage;
