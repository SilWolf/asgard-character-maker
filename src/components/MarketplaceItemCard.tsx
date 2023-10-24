import { BahaTemplateProperties } from "@/types/Baha.type";

type Props = {
  properties: BahaTemplateProperties;
};

const MarketplaceItemCard = ({ properties }: Props) => {
  return (
    <div className="space-y-2">
      <img
        className="aspect-square bg-gray-200"
        src={properties.previewImageUrl}
      />
      <h5 className="text-lg">{properties.name}</h5>
      <p className="text-sm text-gray-600">{properties.briefing}</p>
    </div>
  );
};

export default MarketplaceItemCard;
