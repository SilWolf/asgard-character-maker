import { GoogleAuthLoginButton } from "@/hooks/useGoogleAuth.hook";
import { updateGoogleDriveRequestProps } from "@/helpers/google-drive.helper";
import { TokenResponse } from "@react-oauth/google";
import { useCallback } from "react";

const FirstLandingPage = () => {
  const handleSuccessGoogleLogin = useCallback(
    (tokenResponse: TokenResponse) => {
      updateGoogleDriveRequestProps({
        token: tokenResponse.access_token,
      });
    },
    []
  );

  return (
    <div className="container mx-auto py-16">
      <div className="space-y-6 text-center">
        <h1 className="text-2xl bold">RPG公會角色卡製作器</h1>
        <p>
          這是一套方便RPG玩家製作角色卡的工具，提供了不同角色卡模版，讓玩家輸入資料後，快速生成巴哈創作的代碼。
        </p>
        <p>
          使用此工具需要登入Google帳號，並存取您的Google Drive，用於以下用途：
        </p>
        <ul className="inline-block text-justify list-disc">
          <li>建立、存取自定義模版的資料夾及檔案</li>
          <li>建立、存取匯出的巴哈創作原始碼的資料夾及檔案</li>
        </ul>
        <div></div>
        <div className="inline-block">
          <GoogleAuthLoginButton onSuccess={handleSuccessGoogleLogin} />
        </div>
      </div>
    </div>
  );
};

export default FirstLandingPage;
