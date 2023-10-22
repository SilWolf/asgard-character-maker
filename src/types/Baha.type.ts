export type BahaTemplate = {
  name: string;
  slug: string;
  author: string;
  props: BahaTemplateProp[];
  bahaCode: string;
};

export type BahaTemplateProp = {
  id: string;
  key: string;
  defaultValue: string;
  label: string;
  description: string;
  category: "text" | "color" | "image" | "system";
};
