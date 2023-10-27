export type BahaTemplate = {
  schemaVersion: "1";
  props: BahaTemplateProp[];
  bahaCode: string;
  properties: BahaTemplateProperties;
  detailProperties?: BahaTemplateDetailProperties;
};

export type BahaTemplateProp = {
  id: string;
  key: string;
  defaultValue: string;
  label: string;
  description: string;
  category: "text" | "color" | "url" | "system";
};

export type BahaTemplateProperties = {
  name: string;
  author?: string;
  briefing?: string;
  suitableForNewHome: boolean;
  suitableForOldHome: boolean;
  suitableForWiki: boolean;
  suitableForLightMode: boolean;
  suitableForDarkMode: boolean;
  demoUrl?: string;
  previewImageUrl?: string;
  tags?: string;
};

export type BahaTemplateDetailProperties = {
  description?: string;
  imageUrls?: string[];
};
