import MarketplaceItemCard from "@/components/MarketplaceItemCard";
import {
  getPublicFileByIdAsJSON,
  getPublicFilesByFolderId,
  postUploadJsonObjectAsFile,
} from "@/helpers/google-drive.helper";
import useGoogleAuth from "@/hooks/useGoogleAuth.hook";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplate, BahaTemplateProperties } from "@/types/Baha.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import toast from "react-hot-toast";
import { useEffectOnce } from "react-use";

const fetchMarketplaceItems = () =>
  getPublicFilesByFolderId(
    import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
  );

const MarketplacePage = () => {
  const { setting } = useGoogleAuth();

  const { data } = useInfiniteQuery({
    queryKey: ["marketplace"],
    queryFn: fetchMarketplaceItems,
    initialPageParam: 1,
    getNextPageParam: () => 1,
  });

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

  useEffectOnce(() => {
    getPublicFilesByFolderId(
      import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
    );
  });

  return (
    <PublicLayout>
      <div className="space-y-6">
        <section className="container mx-auto space-y-2">
          <h1 className="text-3xl">範例模板</h1>
          <p>
            這裡取錄了預設的角色卡及模板以供複製使用，推薦初次到來的玩家，從這裡挑選心宜的模板來製作你的角色卡。
          </p>
        </section>

        <section className="container mx-auto grid grid-cols-4 gap-4">
          {data?.pages.map((page) =>
            page.map((item) => (
              <div key={item.id}>
                <div className="shadow shadow-gray-400 p-4 rounded">
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
      </div>
    </PublicLayout>
  );
};

export default MarketplacePage;
