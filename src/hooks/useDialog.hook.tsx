import {
  Modal,
  ModalDialog,
  DialogTitle,
  Divider,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/joy";
import React, {
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useAsyncFn } from "react-use";

type DialogOptions = {
  variant?: "danger";
  title?: React.ReactNode;
  content?: React.ReactNode;
  primaryButtonContent?: React.ReactNode;
  secondaryButtonContent?: React.ReactNode;
  onYes: () => Promise<unknown>;
  onNo?: () => Promise<unknown>;
};

const dialogContextDefaultOptions: DialogOptions = {
  onYes: async () => {},
};

type DialogContextProps = {
  openDialog: (options: DialogOptions) => unknown;
};

const DialogContext = React.createContext<DialogContextProps>({
  openDialog: () => {
    // not implemented
  },
});

const useDialog = () => useContext(DialogContext);

export default useDialog;

type DialogProviderProps = PropsWithChildren;

export const DialogProvider = ({ children }: DialogProviderProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<DialogOptions>(
    dialogContextDefaultOptions
  );

  const openDialog = useCallback((newOptions: DialogOptions) => {
    setOptions(newOptions);
    setOpen(true);
  }, []);

  const closeDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const [{ loading: isLoadingOnYes }, handleYesAsyncFn] = useAsyncFn(
    options.onYes,
    [options.onYes]
  );
  const handleClickYes = useCallback(() => {
    handleYesAsyncFn().then(() => {
      setOpen(false);
    });
  }, [handleYesAsyncFn]);

  const handleClickNo = useCallback(() => {
    if (options.onNo) {
      options.onNo().then(() => {
        setOpen(false);
      });
      return;
    }

    setOpen(false);
  }, [options]);

  const value = useMemo(() => ({ openDialog }), [openDialog]);

  return (
    <DialogContext.Provider value={value}>
      {children}
      <Modal open={open} onClose={closeDialog}>
        <ModalDialog variant="outlined" role="alertdialog">
          <DialogTitle>{options.title || "確定行動"}</DialogTitle>
          <Divider />
          <DialogContent>
            {options.content || "你確定要這樣做嗎？"}
          </DialogContent>
          <DialogActions>
            <Button
              variant="solid"
              color="danger"
              onClick={handleClickYes}
              loading={isLoadingOnYes}
            >
              {options.primaryButtonContent || "確定"}
            </Button>
            <Button variant="plain" color="neutral" onClick={handleClickNo}>
              {options.secondaryButtonContent || "取消"}
            </Button>
          </DialogActions>
        </ModalDialog>
      </Modal>
    </DialogContext.Provider>
  );
};
