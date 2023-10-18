import {
  getFilesByFolderId,
  postCreateFolder,
} from "@/helpers/google-drive.helper";
import { Button, Table } from "@mui/joy";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useEffectOnce, useLocalStorage } from "react-use";

const HomePage = () => {
  const [googleDriveMasterFolderId, setGoogleDriveMasterFolderId] =
    useLocalStorage<string>("acm-google-drive-master-folder-id", undefined, {
      raw: true,
    });
  const [googleDriveSheetsFolderId, setGoogleDriveSheetsFolderId] =
    useLocalStorage<string>("acm-google-drive-sheets-folder-id", undefined, {
      raw: true,
    });
  const [googleDriveTemplatesFolderId, setGoogleDriveTemplatesFolderId] =
    useLocalStorage<string>("acm-google-drive-templates-folder-id", undefined, {
      raw: true,
    });

  const { data: sheets } = useQuery({
    queryKey: ["sheets", googleDriveSheetsFolderId],
    queryFn: () =>
      getFilesByFolderId(googleDriveSheetsFolderId as unknown as string),
    enabled: !!googleDriveSheetsFolderId,
  });

  const { data: templates } = useQuery({
    queryKey: ["templates", googleDriveTemplatesFolderId],
    queryFn: () =>
      getFilesByFolderId(googleDriveTemplatesFolderId as unknown as string),
    enabled: !!googleDriveTemplatesFolderId,
  });

  useEffectOnce(() => {
    if (!googleDriveMasterFolderId) {
      console.log("1");
      toast.promise(
        postCreateFolder("巴哈RPG公會角色卡工具資料庫")
          .then((res) => {
            const parentFolderId = res.data.id;
            setGoogleDriveMasterFolderId(parentFolderId);

            return Promise.all([
              postCreateFolder("角色卡", parentFolderId),
              postCreateFolder("自定義模版", parentFolderId),
            ]);
          })
          .then((results) => {
            const [newSheetsFolderId, newTemplatesFolderId] = results.map(
              (res) => res.data.id
            );

            setGoogleDriveSheetsFolderId(newSheetsFolderId);
            setGoogleDriveTemplatesFolderId(newTemplatesFolderId);
          }),
        {
          loading:
            "偵測到第一次使用此工具，正在在 Google Drive 上初始化所需要的資料夾……",
          success: "初始化成功，作為第一步，點擊「創建新的角色卡」吧。",
          error:
            "初始化失敗，請刷新頁面重試，或通知銀狼 (silwolf167) 尋求協助。",
        }
      );

      // .then(([newSheetsFolderId, newTemplatesFolderId]) => {
      //   setGoogleDriveSheetsFolderId(newSheetsFolderId);
      //   setGoogleDriveTemplatesFolderId(newTemplatesFolderId);
      // });
    }
  });

  return (
    <div className="container mx-auto py-16">
      <div className="space-y-24">
        <section className="space-y-2">
          <div className="flex justify-between">
            <h1 className="text-2xl bold">你的角色卡</h1>
            <div className="text-right">
              <Button size="lg" variant="solid" color="success">
                創建新的角色卡
              </Button>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>名稱</th>
                <th>最後更新日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>卡洛特．海沃爾</td>
                <td>2023-02-03</td>
                <td>
                  <div className="space-x-1">
                    <Button>打開</Button>
                    <Button>匯出紀錄檔</Button>
                    <Button>匯出巴哈原始碼</Button>
                    <Button color="danger" variant="plain">
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </section>

        <section className="space-y-2">
          <div className="flex justify-between">
            <h1 className="text-2xl bold">你的自定義模版</h1>
            <div className="text-right">
              <Button size="lg" variant="solid" color="success">
                創建新的模版
              </Button>
            </div>
          </div>

          <Table>
            <thead>
              <tr>
                <th style={{ width: "40%" }}>名稱</th>
                <th>最後更新日期</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>銀狼整齊版－巴哈新版創作 v1</td>
                <td>2023-02-03</td>
                <td>
                  <div className="space-x-1">
                    <Button>打開</Button>
                    <Button>匯出紀錄檔</Button>
                    <Button>匯出巴哈原始碼</Button>
                    <Button color="danger" variant="plain">
                      刪除
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
