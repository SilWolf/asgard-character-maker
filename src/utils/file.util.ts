import mime from "mime/lite";

export const pickFile = async () =>
  new Promise<File>((res) => {
    const element = document.createElement("input");
    element.setAttribute("type", "file");
    element.addEventListener("change", (e: Event) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        res(file);
      }
    });

    element.click();
  });

export const getFileMime = (filename: string) => mime.getType(filename);

export const readJsonFromFile = <T>(file: File) =>
  new Promise<T>((res) => {
    const onReaderLoad = (event: ProgressEvent<FileReader>) => {
      const obj = JSON.parse(event.target?.result as string);
      res(obj);
    };

    const reader = new FileReader();
    reader.onload = onReaderLoad;
    reader.readAsText(file);
  });
