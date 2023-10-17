/* eslint-disable no-irregular-whitespace */
import { useCallback, useEffect, useState } from "react";
import BahaCode, { BahaTemplate } from "./components/BahaCode";
import { useForm } from "react-hook-form";
import { FormControl, FormHelperText, FormLabel, Textarea } from "@mui/joy";

const App = () => {
  const [template, setTemplate] = useState<BahaTemplate | undefined>(undefined);

  const { register, watch } = useForm();
  const values = watch();

  const handleClickBahaPreview = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      console.log(e);
    },
    []
  );

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
      <div className="mx-auto container flex flex-row gap-x-4 h-screen py-4">
        <section className="flex-0 shrink mx-auto py-4 px-16 overflow-y-scroll rounded-lg shadow-md shadow-gray-400">
          <div id="baha-preview" onClick={handleClickBahaPreview}>
            <BahaCode
              code={template.bahaCode}
              template={template}
              values={values}
            />
          </div>
        </section>
        <section className="flex-1 overflow-y-scroll">
          <form>
            <div>
              {template.textProps.map((prop) => (
                <div
                  key={prop.id}
                  className="odd:bg-gray-100 even:bg-gray-50 py-4 px-4"
                >
                  <FormControl>
                    <FormLabel>{prop.label}</FormLabel>
                    <Textarea
                      placeholder={prop.defaultValue}
                      {...register(prop.id)}
                    />
                    <FormHelperText>{prop.description}</FormHelperText>
                  </FormControl>
                </div>
              ))}
            </div>
          </form>
        </section>
      </div>
    </>
  );
};

export default App;
