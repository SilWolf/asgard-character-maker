import { BahaTemplate } from "@/types/Baha.type";
import reactPreset from "@bbob/preset-react";
import reactRender from "@bbob/react/es/render";
import { useMemo } from "react";

type BBOBNode = {
  tag: string;
  attrs: Record<string, unknown>;
  content: string;
};

const bahaPreset = reactPreset.extend((tags: Record<string, unknown>) => ({
  ...tags,
  img: (node: BBOBNode) => {
    return {
      tag: "img",
      attrs: {
        src: Object.keys(node.attrs).find((key) => key === node.attrs[key]),
        style: {
          width: node.attrs.width ? `${node.attrs.width}px` : "auto",
          height: node.attrs.height ? `${node.attrs.height}px` : "none",
        },
      },
      content: null,
    };
  },
  size: (node: BBOBNode) => {
    return {
      tag: "font",
      attrs: {
        size: Object.keys(node.attrs).find((key) => key === node.attrs[key]),
      },
      content: node.content,
    };
  },
  b: (node: BBOBNode) => {
    return {
      tag: "strong",
      content: node.content,
    };
  },
  color: (node: BBOBNode) => {
    return {
      tag: "span",
      attrs: {
        style: {
          color: Object.keys(node.attrs).find((key) => key === node.attrs[key]),
        },
      },
      content: node.content,
    };
  },
  font: (node: BBOBNode) => {
    return {
      tag: "span",
      attrs: {
        style: {
          "font-family": Object.keys(node.attrs).find(
            (key) => key === node.attrs[key]
          ),
        },
      },
      content: node.content,
    };
  },
}));

type Props = {
  code: string;
  template: Pick<BahaTemplate, "bahaCode" | "props">;
  values: Record<string, string>;
  alwaysFallbackKeys?: boolean;
};

const BahaCode = ({ code, template, values, alwaysFallbackKeys }: Props) => {
  const refinedCode = useMemo(() => {
    let replacedCode = code;

    if (template.props) {
      for (const prop of template.props) {
        replacedCode = replacedCode.replace(
          new RegExp(`\\$${prop.id}\\$`, "g"),
          values[prop.id] ||
            prop.defaultValue ||
            (alwaysFallbackKeys ? prop.key : "")
        );
      }
    }

    return replacedCode;
  }, [alwaysFallbackKeys, code, template.props, values]);

  return reactRender(refinedCode, bahaPreset());
};

export default BahaCode;
