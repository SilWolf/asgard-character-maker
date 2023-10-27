import { BahaTemplateProperties } from "@/types/Baha.type";
import { Button } from "@mui/joy";
import { useMemo } from "react";
// import { Link } from "react-router-dom";
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
  // detailTo,
  onClickDownload,
}: Props) => {
  const tags = useMemo(
    () =>
      properties?.tags
        ? properties.tags.split(",").filter((item) => !!item)
        : [],
    [properties]
  );

  const [{ loading: isDownloading }, handleClickDownload] =
    useAsyncFn(onClickDownload);

  console.log(properties);

  return (
    <div className="space-y-4">
      <img className="bg-neutral-200" src={properties.previewImageUrl} />
      <div>
        <h5 className="text-lg">{properties.name}</h5>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          作者: {properties.author}
        </p>
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        {properties.briefing}
      </p>
      <div className="text-xs text-white dark:text-neutral-400">
        {(properties.suitableForNewHome as unknown as string) === "true" && (
          <div className="inline-block mr-1 mb-1 bg-blue-500 dark:bg-blue-900 text-white dark:text-blue-100 rounded-full px-3 py-1">
            新版小屋
          </div>
        )}
        {(properties.suitableForOldHome as unknown as string) === "true" && (
          <div className="inline-block mr-1 mb-1 bg-blue-500 dark:bg-blue-900 text-white dark:text-blue-100 rounded-full px-3 py-1">
            舊版小屋
          </div>
        )}
        {(properties.suitableForWiki as unknown as string) === "true" && (
          <div className="inline-block mr-1 mb-1 bg-blue-500 dark:bg-blue-900 text-white dark:text-blue-100 rounded-full px-3 py-1">
            Wiki
          </div>
        )}
        {(properties.suitableForLightMode as unknown as string) === "true" && (
          <div className="inline-block mr-1 mb-1 bg-amber-200 dark:bg-amber-200 text-amber-800 dark:text-amber-800 rounded-full px-3 py-1">
            明亮 <i className="uil uil-sun"></i>
          </div>
        )}
        {(properties.suitableForDarkMode as unknown as string) === "true" && (
          <div className="inline-block mr-1 mb-1 bg-indigo-950 dark:bg-indigo-950 text-indigo-200 dark:text-indigo-200 rounded-full px-3 py-1">
            黑闇 <i className="uil uil-moon"></i>
          </div>
        )}
        {tags.map((tag) => (
          <div
            key={tag}
            className="inline-block mr-1 mb-1 bg-neutral-500 dark:bg-neutral-900 text-white dark:text-neutral-100 rounded-full px-3 py-1"
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
        {/* {detailTo && (
          <Link to={detailTo}>
            <Button variant="outlined" color="neutral" data-id={templateId}>
              詳細
            </Button>
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default MarketplaceItemCard;
