import reactPreset from "@bbob/preset-react";
import reactRender from "@bbob/react/es/render";
import { useMemo } from "react";

export type BahaTemplate = {
  slug: string;
  author: string;
  textProps: BahaTemplateProp[];
  imageProps: BahaTemplateProp[];
  colorProps: BahaTemplateProp[];
  bahaCode: string;
};

export type BahaTemplateProp = {
  id: string;
  key: string;
  defaultValue: string;
  description: string;
};

type BBOBNode = {
  tag: string;
  attrs: Record<string, unknown>;
  content: string;
};

const bahaPreset = reactPreset.extend((tags: Record<string, unknown>) => ({
  ...tags,
  img: (node: BBOBNode) => ({
    tag: "img",
    attrs: {
      src: Object.keys(node.attrs).find((key) => key === node.attrs[key]),
      style: {
        width: node.attrs.width ? `${node.attrs.width}px` : "100%",
        height: node.attrs.height ? `${node.attrs.height}px` : "none",
      },
    },
    content: null,
  }),
  size: (node: BBOBNode) => ({
    tag: "font",
    attrs: {
      size: Object.keys(node.attrs).find((key) => key === node.attrs[key]),
    },
    content: node.content,
  }),
}));

type Props = {
  code: string;
  template: BahaTemplate;
  values: Record<string, string>;
};

const BahaCode = ({ code, template, values }: Props) => {
  const refinedCode = useMemo(() => {
    const props = [
      ...template.textProps,
      ...template.imageProps,
      ...template.colorProps,
    ];

    let replacedCode = code;

    for (const prop of props) {
      replacedCode = replacedCode.replace(
        new RegExp(`\\$${prop.id}\\$`, "g"),
        values[prop.id] ?? prop.defaultValue
      );
    }

    return replacedCode;
  }, [
    code,
    template.colorProps,
    template.imageProps,
    template.textProps,
    values,
  ]);

  return reactRender(refinedCode, bahaPreset());
};

export default BahaCode;
