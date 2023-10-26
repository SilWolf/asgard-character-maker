import { BahaTemplateProperties } from "@/types/Baha.type";
import { Button } from "@mui/joy";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAsyncFn } from "react-use";

type Props = {
  templateId: string;
  properties: BahaTemplateProperties;
  detailTo?: string;
  onClickDownload: (e: React.MouseEvent<HTMLButtonElement>) => Promise<unknown>;
};

const MarketplaceItemCard = ({
  templateId,
  properties,
  detailTo,
  onClickDownload,
}: Props) => {
  const tags = useMemo(() => properties.tags.split(","), [properties.tags]);

  const [{ loading: isDownloading }, handleClickDownload] =
    useAsyncFn(onClickDownload);

  return (
    <div className="space-y-4">
      <img className="bg-gray-200" src={properties.previewImageUrl} />
      <div>
        <h5 className="text-lg">{properties.name}</h5>
        <p className="text-sm text-gray-600">作者: {properties.author}</p>
      </div>
      <p className="text-sm text-gray-600">{properties.briefing}</p>
      <div className="space-x-1 text-xs text-white">
        {tags.map((tag) => (
          <div
            key={tag}
            className="inline-block bg-gray-500 rounded-full px-3 py-1"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="space-x-1">
        <Button
          variant="outlined"
          loading={isDownloading}
          onClick={handleClickDownload}
          data-id={templateId}
        >
          下載此模板
        </Button>
        {detailTo && (
          <Link to={detailTo}>
            <Button variant="outlined" color="neutral" data-id={templateId}>
              詳細
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MarketplaceItemCard;
