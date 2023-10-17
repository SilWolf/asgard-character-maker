/* eslint-disable no-irregular-whitespace */
import { useEffect, useState } from "react";
import BahaCode, { BahaTemplate } from "./components/BahaCode";

const App = () => {
  const [template, setTemplate] = useState<BahaTemplate | undefined>(undefined);

  useEffect(() => {
    fetch(`/baha-templates/character-sheet-silwolf-v1.json`)
      .then((res) => res.json())
      .then(setTemplate);
  }, []);

  if (!template) {
    return <></>;
  }

  return (
    <>
      <header id="header"></header>
      <section className="mx-auto shadow">
        <div id="baha-preview">
          <BahaCode code={template.bahaCode} template={template} values={{}} />
        </div>
      </section>
    </>
  );
};

export default App;
