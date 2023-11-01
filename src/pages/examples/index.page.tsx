import ExampleItemCard from "@/components/ExampleItemCard";
import {
  GoogleDriveFile,
  getFilesByFolderId,
  getPublicFileByIdAsJSON,
  patchFileProperties,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import PublicLayout from "@/layouts/public.layout";
import { Sheet, SheetProperties } from "@/types/Sheet.type";
import { Button, Checkbox, FormControl, FormLabel, Input } from "@mui/joy";
import {
  QueryFunction,
  keepPreviousData,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { FormEvent, useCallback, useState } from "react";
import toast from "react-hot-toast";

const fetchExampleItems: QueryFunction<
  { files: GoogleDriveFile[]; nextPageToken: string | null },
  string[],
  string | null
> = ({ queryKey }) =>
  getFilesByFolderId(import.meta.env.VITE_GOOGLE_DRIVE_EXAMPLE_FOLDER_ID, {
    isPublic: true,
    rawFilter: queryKey[1],
  });

const ExamplesPage = () => {
  const { setting } = useGoogleAuth();
  const [rawFilter, setRawFilter] = useState<string>("");

  const {
    data,
    isFetching: isSearching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["examples", rawFilter],
    queryFn: fetchExampleItems,
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextPageToken,
    placeholderData: keepPreviousData,
  });

  const handleClickSubmitFilter = useCallback((e: FormEvent) => {
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
      const sheetId = e.currentTarget.getAttribute("data-id");
      if (!sheetId) {
        return Promise.resolve();
      }

      return toast.promise(
        getPublicFileByIdAsJSON<Sheet>(sheetId).then((sheet) => {
          return postUploadJsonObjectAsFile(
            sheet,
            `${sheet.properties.name}.json`,
            setting?.sheetsFolderId
          ).then((res) => patchFileProperties(res.data.id, sheet.properties));
        }),
        {
          loading: "正在下載角色卡，這可能需要一點時間……",
          success: "下載成功！你可在你的角色卡中找到它。",
          error: "下載失敗，請重試。",
        }
      );
    },
    [setting?.sheetsFolderId]
  );

  return (
    <PublicLayout>
      <div className="space-y-6">
        <section className="container mx-auto max-w-screen-md space-y-2">
          <h1 className="text-3xl">實用範例</h1>
          <p>
            這裡收錄了使用工具製作出來的創作範例，從這裡可以參考別人如何使用此工具。
          </p>
        </section>

        <section className="container mx-auto max-w-screen-md">
          <form onSubmit={handleClickSubmitFilter}>
            <div className="bg-neutral-100 dark:bg-neutral-900 rounded py-4 px-8 space-y-4">
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
                      label="使用新版小屋"
                      defaultChecked
                      value="1"
                      name="suitableForNewHome"
                    />
                    <Checkbox
                      label="使用舊版小屋"
                      defaultChecked
                      value="1"
                      name="suitableForOldHome"
                    />
                    <Checkbox
                      label="使用Wiki"
                      defaultChecked
                      value="1"
                      name="suitableForWiki"
                    />
                  </div>
                  <div className="space-x-4">
                    <Checkbox
                      label="使用明亮模式"
                      defaultChecked
                      value="1"
                      name="suitableForLightMode"
                    />
                    <Checkbox
                      label="使用黑闇模式"
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

        <section className="container mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data?.pages.map((page) =>
            page.files.map((item) => (
              <div key={item.id}>
                <div className="shadow bg-white dark:bg-neutral-800 shadow-neutral-400 dark:shadow-neutral-600 p-4 rounded">
                  <ExampleItemCard
                    sheetId={item.id}
                    properties={item.properties as unknown as SheetProperties}
                    onClickDownload={handleClickDownload}
                    detailTo={`/examples/${item.id}`}
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

export default ExamplesPage;
