import { BahaTemplate } from "./Baha.type";

export type Sheet = {
  templatesMap: Record<string, SheetTemplate>;
  sectionsMap: Record<string, SheetSection>;
  layout: SheetLayoutRow[];
  properties: SheetProperties;
};

export type SheetLayoutRow = {
  id: string;
  cols: SheetLayoutCol[];
};

export type SheetLayoutCol = {
  id: string;
  width: string;
  sectionIds: string[];
};

export type SheetTemplate = Pick<BahaTemplate, "bahaCode" | "props"> & {
  name: string;
};

export type SheetSection = {
  id: string;
  name: string;
  templateId: string;
  value: Record<string, string>[];
};

export type SheetProperties = {
  name: string;
  author: string;
  briefing: string;
  description: string;
  demoUrl: string;
  previewImageUrl: string;
  imageUrls: string[];
  tags: string;
  viewMode: "light" | "dark";
  previewMode:
    | "baha-preview-new-home"
    | "baha-preview-old-home"
    | "baha-preview-wiki";
};
