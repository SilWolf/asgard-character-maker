export type BahaTemplate = {
  slug: string;
  author: string;
  textProps: BahaTemplateProp[];
  systemTextProps: BahaTemplateProp[];
  imageProps: BahaTemplateProp[];
  colorProps: BahaTemplateProp[];
  bahaCode: string;
};

export type BahaTemplateProp = {
  id: string;
  key: string;
  defaultValue: string;
  label: string;
  description: string;
};
