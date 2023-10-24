import MarketplaceItemCard from "@/components/MarketplaceItemCard";
import { getPublicFilesByFolderId } from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { BahaTemplateProperties } from "@/types/Baha.type";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffectOnce } from "react-use";

const fetchMarketplaceItems = () =>
  getPublicFilesByFolderId(
    import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
  );

const MarketplacePage = () => {
  const { data } = useInfiniteQuery({
    queryKey: ["marketplace"],
    queryFn: fetchMarketplaceItems,
    initialPageParam: 1,
    getNextPageParam: () => 1,
  });

  useEffectOnce(() => {
    getPublicFilesByFolderId(
      import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
    );
  });

  return (
    <PublicLayout>
      <div className="space-y-6">
        <section className="container mx-auto space-y-2">
          <h1 className="text-3xl">範例模版</h1>
          <p>
            這裡取錄了預設的角色卡及模版以供複製使用，推薦初次到來的玩家，從這裡挑選心宜的模版來製作你的角色卡
          </p>
        </section>

        <section className="container mx-auto grid grid-cols-4 gap-4">
          {data?.pages.map((page) =>
            page.map((item) => (
              <div key={item.id}>
                <div className="shadow shadow-gray-400 p-4 rounded">
                  <MarketplaceItemCard
                    properties={
                      item.properties as unknown as BahaTemplateProperties
                    }
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
