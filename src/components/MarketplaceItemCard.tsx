import { BahaTemplateProperties } from "@/types/Baha.type";
import { useMemo } from "react";

type Props = {
  properties: BahaTemplateProperties;
};

const MarketplaceItemCard = ({ properties }: Props) => {
  const tags = useMemo(() => properties.tags.split(","), [properties.tags]);

  return (
    <div className="space-y-4">
      <img
        className="aspect-square bg-gray-200"
        src={properties.previewImageUrl}
      />
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
    </div>
  );
};

export default MarketplaceItemCard;
