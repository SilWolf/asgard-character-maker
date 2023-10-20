import { BahaTemplate } from "./Baha.type";

export type Sheet = {
  slug: string;
  name: string;
  author: string;
  sections: SheetSection[];
};

export type SheetSection = {
  id: string;
  name: string;
  template: BahaTemplate;
  value: Record<string, string>;
};
