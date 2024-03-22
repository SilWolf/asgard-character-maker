import {
  Sheet,
  SheetLayoutRow,
  SheetSection,
  SheetTemplate,
} from "@/types/Sheet.type";
import { utilArrayOrder } from "@/utils/array.util";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalDialog,
  DialogTitle,
  Table,
} from "@mui/joy";
import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { useForm } from "react-hook-form";
import EditTemplateModal from "./editTemplate.modal";

type SectionFormProps = {
  sheet: Sheet;
  onSubmit: (
    newValue: Pick<SheetSection, "id" | "name" | "templateId">
  ) => Promise<unknown>;
  defaultValues?: Partial<Pick<SheetSection, "id" | "name" | "templateId">>;
  count?: number;
  submitButtonChildren?: React.ReactNode;
};

const SectionForm = ({
  sheet,
  onSubmit,
  defaultValues,
  count,
  submitButtonChildren = "新增區塊",
}: SectionFormProps) => {
  const { data: templates } = useCustomTemplates();
  const [{ loading: isSubmitting }, handleSubmitAsynFn] = useAsyncFn(onSubmit, [
    onSubmit,
  ]);

  const {
    register,
    reset,
    handleSubmit: handleRHFSubmit,
  } = useForm<Pick<SheetSection, "id" | "name" | "templateId">>({
    defaultValues,
  });

  const templatesInSheet = useMemo(
    () =>
      Object.entries(sheet.templatesMap).map(([key, value]) => ({
        key,
        value,
      })),
    [sheet.templatesMap]
  );

  const namePlaceholder = useMemo(() => `區塊${(count ?? 0) + 1}`, [count]);

  const handleSubmit = useMemo(
    () =>
      handleRHFSubmit((newValue) => {
        handleSubmitAsynFn({
          ...newValue,
          id: newValue.id || `section_${utilGetUniqueId()}`,
        });
      }),
    [handleRHFSubmit, handleSubmitAsynFn]
  );

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormControl required>
        <FormLabel>選擇一個模板</FormLabel>
        <select
          className="my-select"
          placeholder="選擇…"
          {...register("templateId", { required: true })}
          required
        >
          <optgroup label="已匯入的模板">
            {templatesInSheet.map(({ key, value }) => (
              <option key={key} value={key}>
                {value.name}
              </option>
            ))}
          </optgroup>
          <optgroup label="自定義的模板">
            {templates?.files.map((template) => (
              <option key={template.id} value={template.id}>
                {template.properties.name}
              </option>
            ))}
          </optgroup>
        </select>
      </FormControl>

      <FormControl>
        <FormLabel>區塊名稱</FormLabel>
        <Input placeholder={namePlaceholder} {...register("name")} />
      </FormControl>

      <Button type="submit" color="success" loading={isSubmitting}>
        {submitButtonChildren}
      </Button>
    </form>
  );
};

type LayoutRowDivProps = {
  sheet: Sheet;
  row: SheetLayoutRow;
  onClickVisibility: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickEdit: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickClone: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClickDelete: (e: React.MouseEvent<HTMLButtonElement>) => void;
};

const LayoutRowDiv = ({
  sheet,
  row,
  onClickVisibility,
  onClickEdit,
  onClickClone,
  onClickDelete,
}: LayoutRowDivProps) => {
  const { name, templateName } = useMemo(() => {
    const section = sheet.sectionsMap[row.cols[0]?.sectionIds[0]];
    if (!section) {
      return {
        name: "（找不到區塊）",
        templateName: "（找不到模板）",
      };
    }

    const template = sheet.templatesMap[section.templateId];
    if (!template) {
      return {
        name: section.name,
        templateName: "（找不到模板）",
      };
    }

    return {
      name: section.name,
      templateName: template.name,
    };
  }, [row.cols, sheet.sectionsMap, sheet.templatesMap]);

  return (
    <div className="flex justify-between items-center">
      <div className="shrink-0"></div>
      <div className="flex-1">
        {name}
        <span className="text-xs text-neutral-600 dark:text-neutral-400">
          {" "}
          ({templateName})
        </span>
      </div>
      <div className="shrink-0 space-x-1">
        <Button
          size="sm"
          color="primary"
          variant="plain"
          data-id={row.id}
          onClick={onClickVisibility}
        >
          {row.hidden ? "顯示" : "隱藏"}
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="plain"
          data-id={row.id}
          onClick={onClickEdit}
        >
          修改
        </Button>
        <Button
          size="sm"
          color="primary"
          variant="plain"
          data-id={row.id}
          onClick={onClickClone}
        >
          複製
        </Button>
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
  onSubmitSection: (
    newSection: Pick<SheetSection, "id" | "name" | "templateId"> &
      Partial<Pick<SheetSection, "value">>
  ) => Promise<unknown>;
  onSubmitTemplate: (
    newSection: SheetTemplate & { id: string }
  ) => Promise<unknown>;
  onSubmitLayout: (newLayout: Sheet["layout"], fullRefresh?: boolean) => void;
};

const SheetDetailLayoutAndSectionsSubPage = ({
  sheet,
  onSubmitSection,
  onSubmitTemplate,
  onSubmitLayout,
}: Props) => {
  const { openDialog } = useDialog();

  const inUseTemplates = useMemo(
    () => Object.entries(sheet.templatesMap),
    [sheet.templatesMap]
  );

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) {
        return;
      }

      onSubmitLayout(
        utilArrayOrder(
          sheet.layout,
          result.source.index,
          result.destination.index
        )
      );
    },
    [onSubmitLayout, sheet.layout]
  );

  const [editSectionDefaultValues, setEditSectionDefaultValues] = useState<
    Pick<SheetSection, "id" | "name" | "templateId"> | undefined
  >();
  const clearSectionDefaultValues = useCallback(
    () => setEditSectionDefaultValues(undefined),
    []
  );
  const handleSubmitSection = useCallback(
    (
      newValue: Pick<SheetSection, "id" | "name" | "templateId"> &
        Partial<Pick<SheetSection, "value">>
    ) => {
      return onSubmitSection(newValue).then(() => {
        setEditSectionDefaultValues(undefined);
      });
    },
    [onSubmitSection]
  );

  const handleVisibilityRow = useCallback(
    (e: React.MouseEvent) => {
      const targetRowId = e.currentTarget.getAttribute("data-id") as string;
      const rowIndex = sheet.layout.findIndex(({ id }) => id === targetRowId);
      if (rowIndex === -1) {
        return;
      }

      const newLayout = [...sheet.layout];
      newLayout[rowIndex] = {
        ...newLayout[rowIndex],
        hidden: !newLayout[rowIndex].hidden,
      };

      onSubmitLayout(newLayout);
    },
    [onSubmitLayout, sheet.layout]
  );

  const handleEditRow = useCallback(
    (e: React.MouseEvent) => {
      const targetRowId = e.currentTarget.getAttribute("data-id") as string;
      const row = sheet.layout.find(({ id }) => id === targetRowId);
      if (!row) {
        return;
      }

      const sectionId = row.cols[0]?.sectionIds[0];
      if (!sectionId) {
        return;
      }

      const section = sheet.sectionsMap[sectionId];
      if (!section) {
        return;
      }

      setEditSectionDefaultValues(section);
    },
    [sheet.layout, sheet.sectionsMap]
  );

  const handleCloneRow = useCallback(
    (e: React.MouseEvent) => {
      const targetRowId = e.currentTarget.getAttribute("data-id") as string;
      const rowIndex = sheet.layout.findIndex(({ id }) => id === targetRowId);
      const row = sheet.layout[rowIndex];

      if (!row) {
        return;
      }

      const sectionId = row.cols[0]?.sectionIds[0];
      if (!sectionId) {
        return;
      }

      const section = sheet.sectionsMap[sectionId];
      if (!section) {
        return;
      }

      handleSubmitSection({
        id: `section_${utilGetUniqueId()}`,
        name: section.name + " - 複製",
        templateId: section.templateId,
        value: JSON.parse(JSON.stringify(section.value)),
      });
    },
    [handleSubmitSection, sheet.layout, sheet.sectionsMap]
  );

  const handleDeleteRow = useCallback(
    (e: React.MouseEvent) => {
      const targetRowId = e.currentTarget.getAttribute("data-id") as string;

      openDialog({
        title: "刪除區塊",
        content: "確定要刪除區塊嗎？",
        onYes: async () => {
          const newRows = sheet.layout.filter(({ id }) => id !== targetRowId);
          return onSubmitLayout(newRows, true);
        },
      });
    },
    [onSubmitLayout, openDialog, sheet.layout]
  );

  const [editTemplateDefaultValues, setEditTemplateDefaultValues] = useState<
    (SheetTemplate & { id: string }) | undefined
  >();
  const clearTemplateDefaultValues = useCallback(
    () => setEditTemplateDefaultValues(undefined),
    []
  );
  const handleSubmitTemplate = useCallback(
    (newBahaCode: string) => {
      if (!editTemplateDefaultValues) {
        return Promise.resolve();
      }

      return onSubmitTemplate({
        ...editTemplateDefaultValues,
        bahaCode: newBahaCode,
      }).then(() => {
        setEditTemplateDefaultValues(undefined);
      });
    },
    [editTemplateDefaultValues, onSubmitTemplate]
  );

  const handleEditTemplate = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const templateId = e.currentTarget.getAttribute(
        "data-template-id"
      ) as string;
      const template = sheet.templatesMap[templateId];

      if (!template) {
        return;
      }

      setEditTemplateDefaultValues({
        ...template,
        id: templateId,
      });
    },
    [sheet.templatesMap]
  );

  return (
    <>
      <div className="container mx-auto max-w-screen-md">
        <div className="space-y-12">
          <div className="mx-auto container max-w-screen-md space-y-6">
            <h2 className="text-2xl">新增區塊</h2>
            <div className="shadow shadow-neutral-400 p-8 rounded">
              <SectionForm sheet={sheet} onSubmit={handleSubmitSection} />
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl">佈局</h2>

            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {sheet.layout.map((row, index) => (
                      <Draggable
                        key={row.id}
                        draggableId={row.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            className="bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 rounded px-2 py-3 mb-2 flex items-center gap-x-2 data-[hidden=true]:opacity-20"
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            data-hidden={!!row.hidden}
                          >
                            <div
                              className="shrink-0"
                              {...provided.dragHandleProps}
                            >
                              <i className="uil uil-draggabledots"></i>
                            </div>
                            <div className="flex-1">
                              <LayoutRowDiv
                                sheet={sheet}
                                row={row}
                                onClickVisibility={handleVisibilityRow}
                                onClickEdit={handleEditRow}
                                onClickClone={handleCloneRow}
                                onClickDelete={handleDeleteRow}
                              />
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl">已匯入的模板</h2>

            <Table>
              <thead>
                <tr>
                  <th>模板名稱</th>
                  <th>
                    <p className="text-right">操作</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {inUseTemplates?.map(([templateId, template]) => (
                  <tr key={templateId}>
                    <td>{template.name}</td>
                    <td className="text-right">
                      <div className="space-x-1">
                        <Button
                          variant="plain"
                          data-template-id={templateId}
                          onClick={handleEditTemplate}
                        >
                          修改
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </div>
      </div>

      <Modal
        open={!!editSectionDefaultValues}
        onClose={clearSectionDefaultValues}
      >
        <ModalDialog>
          <DialogTitle>修改現有區塊</DialogTitle>
          <div className="w-[480px] max-w-full">
            <SectionForm
              sheet={sheet}
              defaultValues={editSectionDefaultValues}
              onSubmit={handleSubmitSection}
              submitButtonChildren="修改區塊"
            />
          </div>
        </ModalDialog>
      </Modal>

      <EditTemplateModal
        open={!!editTemplateDefaultValues}
        onClose={clearTemplateDefaultValues}
        onSubmit={handleSubmitTemplate}
        defaultBahaCode={editTemplateDefaultValues?.bahaCode ?? ""}
      />
    </>
  );
};

export default SheetDetailLayoutAndSectionsSubPage;
