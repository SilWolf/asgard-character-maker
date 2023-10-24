import { getPublicFilesByFolderId } from "@/helpers/google-drive.helper";
import PublicLayout from "@/layouts/public.layout";
import { useEffectOnce } from "react-use";

const MarketplacePage = () => {
  useEffectOnce(() => {
    getPublicFilesByFolderId(
      import.meta.env.VITE_GOOGLE_DRIVE_MARKETPLACE_FOLDER_ID
    );
  });

  return (
    <PublicLayout>
      <div className="space-y-6">
        <section className="container mx-auto space-y-2">
          <h1 className="text-3xl">範例角色卡＆模版</h1>
          <p>
            這裡取錄了預設的角色卡及模版以供複製使用，推薦初次到來的玩家，從這裡挑選心宜的模版來製作你的角色卡
          </p>
        </section>

        <section className="container mx-auto grid grid-cols-4 gap-4">
          <div>a</div>
          <div>a</div>
          <div>a</div>
          <div>a</div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default MarketplacePage;
