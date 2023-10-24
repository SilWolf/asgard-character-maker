import { Sheet, SheetLayoutRow, SheetSection } from "@/types/Sheet.type";
import { utilArrayOrder } from "@/utils/array.util";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Option,
} from "@mui/joy";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";
import { useAsyncFn } from "react-use";
import useCustomTemplates from "@/hooks/useCustomTemplates.hook";
import { utilGetUniqueId } from "@/utils/string.util";
import useDialog from "@/hooks/useDialog.hook";

type LayoutRowDivProps = {
  sheet: Sheet;
  row: SheetLayoutRow;
  onClickDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};
const LayoutRowDiv = ({ sheet, row, onClickDelete }: LayoutRowDivProps) => {
  const { name, templateName } = useMemo(() => {
    const section = sheet.sectionsMap[row.cols[0]?.sectionIds[0]];
    if (!section) {
      return {
        name: "（找不到區塊）",
        templateName: "（找不到模版）",
      };
    }

    const template = sheet.templatesMap[section.templateId];
    if (!template) {
      return {
        name: section.name,
        templateName: "（找不到模版）",
      };
    }

    return {
      name: section.name,
      templateName: template.name,
    };
  }, [row.cols, sheet.sectionsMap, sheet.templatesMap]);

  return (
    <div className="flex justify-between items-center">
      <div>
        {name} - {templateName}
      </div>
      <div className="space-x-1">
        <Button
          size="sm"
          color="danger"
          variant="plain"
          data-id={row.id}
          onClick={onClickDelete}
        >
          刪除
        </Button>
      </div>
    </div>
  );
};

type Props = {
  sheet: Sheet;
  onSubmitSection: (newSection: SheetSection) => Promise<unknown>;
  onSubmitLayout: (newLayout: Sheet["layout"], fullRefresh?: boolean) => void;
};

const SheetDetailLayoutAndSectionsSubPage = ({
  sheet,
  onSubmitSection,
  onSubmitLayout,
}: Props) => {
  const { data: templates } = useCustomTemplates();
  const { openDialog } = useDialog();

  const [rows, setRows] = useState<Sheet["layout"]>([]);

  const handleDragEnd = useCallback((result: DropResult) => {
    setRows((prev) => {
      if (!result.destination) {
        return prev;
      }

      return utilArrayOrder(
        prev,
        result.source.index,
        result.destination.index
      );
    });
  }, []);

  const namePlaceholder = useMemo(
    () => `區塊${Object.entries(sheet.sectionsMap).length + 1}`,
    [sheet.sectionsMap]
  );
  const [{ loading: isSubmittingSection }, onSubmitSectionAsyncFn] =
    useAsyncFn(onSubmitSection);
  const handleSubmitNewSection = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const form = e.currentTarget as HTMLFormElement;

      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const formJson = Object.fromEntries(
        formData.entries()
      ) as unknown as SheetSection;

      onSubmitSectionAsyncFn({
        id: `section_${utilGetUniqueId()}`,
        name: formJson.name || namePlaceholder,
        templateId: formJson.templateId,
        value: [{}],
      }).then(() => {
        form.reset();
      });
    },
    [namePlaceholder, onSubmitSectionAsyncFn]
  );

  const handleDeleteRow = useCallback(
    (e: React.MouseEvent) => {
      const targetRowId = e.currentTarget.getAttribute("data-id") as string;

      openDialog({
        title: "刪除區塊",
        content: "確定要刪除區塊嗎？",
        onYes: async () => {
          const newRows = rows.filter(({ id }) => id !== targetRowId);
          return onSubmitLayout(newRows, true);
        },
      });
    },
    [onSubmitLayout, openDialog, rows]
  );

  const handleClickSaveLayout = useCallback(() => {
    onSubmitLayout(rows);
  }, [onSubmitLayout, rows]);

  useEffect(() => {
    setRows(sheet.layout);
  }, [sheet.layout]);

  return (
    <div className="container mx-auto max-w-screen-md">
      <div className="space-y-12">
        <div className="space-y-6">
          <h2 className="text-2xl">新的區塊</h2>

          <form onSubmit={handleSubmitNewSection}>
            <div className="mx-auto container max-w-screen-md space-y-6">
              <h2 className="text-xl">新增區塊</h2>
              <div className="shadow shadow-gray-400 p-8 rounded space-y-6">
                <FormControl required>
                  <FormLabel>選擇一個模版</FormLabel>
                  <Select placeholder="選擇…" name="templateId">
                    {templates?.map((template) => (
                      <Option key={template.id} value={template.id}>
                        {template.name}
                      </Option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>區塊名稱</FormLabel>
                  <Input placeholder={namePlaceholder} name="name" />
                </FormControl>

                <Button
                  type="submit"
                  color="success"
                  loading={isSubmittingSection}
                >
                  新增區塊
                </Button>
              </div>
            </div>
          </form>
        </div>
        <div className="space-y-6">
          <h2 className="text-2xl">佈局</h2>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="droppable">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {rows.map((row, index) => (
                    <Draggable key={row.id} draggableId={row.id} index={index}>
                      {(provided) => (
                        <div
                          className="bg-gray-100 border border-gray-300 rounded px-4 py-3 mb-2"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <LayoutRowDiv
                            sheet={sheet}
                            row={row}
                            onClickDelete={handleDeleteRow}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          <div>
            <Button color="success" onClick={handleClickSaveLayout}>
              儲存新的佈局
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SheetDetailLayoutAndSectionsSubPage;
