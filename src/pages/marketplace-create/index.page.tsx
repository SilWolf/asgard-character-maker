import PublicLayout from "@/layouts/public.layout";
import { BahaTemplateProperties } from "@/types/Baha.type";
import {
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
} from "@mui/joy";
import { useForm } from "react-hook-form";

const MarketplaceCreatePage = () => {
  const { register } = useForm<
    Pick<
      BahaTemplateProperties,
      "name" | "author" | "briefing" | "demoUrl" | "previewImageUrl" | "tags"
    >
  >({
    defaultValues: {},
  });

  return (
    <PublicLayout>
      <div className="container mx-auto max-w-screen-md space-y-6">
        <form className="space-y-6">
          <FormControl required>
            <FormLabel>模版名稱</FormLabel>
            <Input
              {...register("name", { required: true })}
              className="max-w-[400px]"
            />
          </FormControl>

          <FormControl>
            <FormLabel>作者</FormLabel>
            <Input {...register("author")} className="max-w-[200px]" />
            <FormHelperText>
              建議使用 <span className="bold">暱稱 (巴哈帳號)</span>{" "}
              的格式，例如 <span className="bold">銀狼 (silwolf167)</span>。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>介紹</FormLabel>
            <Input {...register("briefing")} />
            <FormHelperText>
              簡介這個模版可用於什麼場景、有怎樣的風格。
            </FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>示範的小屋創作連結</FormLabel>
            <Input
              {...register("demoUrl")}
              placeholder="https://home.gamer.com.tw/artwork.php?sn=1234567"
            />
            <FormHelperText>使用了這個模版的示範創作。</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>預覽圖片</FormLabel>
            <Input
              {...register("previewImageUrl")}
              placeholder="https://i.imgur.com/image.png"
            />
            <FormHelperText>建議採用 16:9 比例的圖片</FormHelperText>
          </FormControl>

          <FormControl>
            <FormLabel>標籤</FormLabel>
            <Input {...register("tags")} placeholder="新版小屋,簡約,整齊" />
            <FormHelperText>
              能形容模版的關鍵字，以方便用戶搜索。用逗號(,)分隔每個標籤。
            </FormHelperText>
          </FormControl>

          <Button type="submit">發佈</Button>
        </form>
      </div>
    </PublicLayout>
  );
};

export default MarketplaceCreatePage;
