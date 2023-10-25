import { PropsWithChildren, useState } from "react";
import { Tab, TabList, Tabs } from "@mui/joy";

type Props = PropsWithChildren<{
  defaultView?: "0";
}>;

const BahaCodePreviewWrapper = ({ children }: Props) => {
  const [activeView, setActiveView] = useState<string>("");

  return (
    <>
      <div>
        <Tabs orientation="horizontal" size="sm">
          <TabList disableUnderline>
            <Tab
              variant="outlined"
              color="neutral"
              disableIndicator
              indicatorInset
            >
              新版小屋
            </Tab>
            <Tab
              variant="outlined"
              color="neutral"
              disableIndicator
              indicatorInset
            >
              舊版小屋
            </Tab>
            <Tab
              variant="outlined"
              color="neutral"
              disableIndicator
              indicatorInset
            >
              Wiki
            </Tab>
          </TabList>
        </Tabs>
      </div>
      <div className="h-full">
        <div className="baha-preview">{children}</div>
      </div>
    </>
  );
};

export default BahaCodePreviewWrapper;
