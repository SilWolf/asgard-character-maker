import useGoogleAuth, {
  GoogleAuthLoginButton,
  GoogleDriveAppSetting,
} from "@/hooks/useGoogleAuth.hook";
import {
  getFileByNameAsJSON,
  postCreateFolder,
  postUploadJsonObjectAsFile,
  updateGoogleDriveRequestProps,
} from "@/helpers/google-drive.helper";
import { TokenResponse } from "@react-oauth/google";
import PublicLayout from "@/layouts/public.layout";
import { useAsyncFn } from "react-use";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const LoginPage = () => {
  const { setToken, setSetting } = useGoogleAuth();
  const navigate = useNavigate();

  const [{ loading: isLogining }, handleSuccessGoogleLogin] = useAsyncFn(
    async (tokenResponse: TokenResponse) => {
      updateGoogleDriveRequestProps({
        token: tokenResponse.access_token,
      });

      return getFileByNameAsJSON<GoogleDriveAppSetting>("setting.json")
        .then((setting) => {
          if (!setting) {
            return toast.promise(
              Promise.all([
                postCreateFolder("角色卡"),
                postCreateFolder("模板"),
              ]).then(async (results) => {
                const [newSheetsFolderId, newTemplatesFolderId] = results.map(
                  (res) => res.data.id
                );

                const newSetting = {
                  sheetsFolderId: newSheetsFolderId,
                  templatesFolderId: newTemplatesFolderId,
                };

                await postUploadJsonObjectAsFile(newSetting, "setting.json");

                return {
                  sheetsFolderId: newSheetsFolderId,
                  templatesFolderId: newTemplatesFolderId,
                };
              }),
              {
                loading:
                  "偵測到第一次使用此工具，正在在 Google Drive 上初始化所需要的資料夾……",
                success: "初始化成功，作為第一步，點擊「創建新的角色卡」吧。",
                error:
                  "初始化失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
              }
            );
          }

          return setting;
        })
        .then((setting) => {
          setToken(tokenResponse.access_token);
          setSetting(setting);
          navigate("/");
        });
    },
    []
  );

  if (isLogining) {
    return (
      <PublicLayout>
        <div className="container mx-auto text-center">讀取中…</div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="container mx-auto">
        <div className="space-y-6 text-center">
          <h1 className="text-2xl bold">RPG公會創作模板工具</h1>
          <p>
            這是一套方便RPG玩家製作角色卡的工具，提供了不同角色卡模板，讓玩家輸入資料後，快速生成巴哈創作的代碼。
          </p>
          <p>
            使用此工具需要登入Google帳號，並存取您的Google Drive，用於以下用途：
          </p>
          <ul className="inline-block text-justify list-disc">
            <li>建立、存取自定義模板的資料夾及檔案</li>
            <li>建立、存取匯出的巴哈創作原始碼的資料夾及檔案</li>
          </ul>
          <div></div>
          <div className="inline-block">
            <GoogleAuthLoginButton onSuccess={handleSuccessGoogleLogin} />
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default LoginPage;
