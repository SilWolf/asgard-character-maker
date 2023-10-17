import reactPreset from "@bbob/preset-react";
import reactRender from "@bbob/react/es/render";

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
};

const BahaCode = ({ code }: Props) => {
  return reactRender(code, bahaPreset());
};

export default BahaCode;
