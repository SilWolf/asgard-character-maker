export type BahaTemplate = {
  props: BahaTemplateProp[];
  bahaCode: string;
  properties: BahaTemplateProperties;
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
  author: string;
  briefing: string;
  description: string;
  suitableForNewHome: boolean;
  suitableForOldHome: boolean;
  suitableForWiki: boolean;
  suitableForLightMode: boolean;
  suitableForDarkMode: boolean;
  demoUrl: string;
  previewImageUrl: string;
  imageUrls: string[];
  tags: string;
};

export type BahaTemplatePropertiesTemplate = {
  id: string;
  name: string;
};
