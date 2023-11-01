import {
  Alert,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  FormLabel,
  Modal,
  ModalDialog,
  ModalProps,
  Textarea,
} from "@mui/joy";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

type Props = Omit<ModalProps, "children" | "onSubmit"> & {
  defaultBahaCode: string;
  onSubmit: (newBahaCode: string) => Promise<unknown>;
};

const EditTemplateModal = ({
  defaultBahaCode,
  onSubmit,
  ...modalProps
}: Props) => {
  const {
    register,
    reset,
    handleSubmit: rhfSubmit,
  } = useForm<{ bahaCode: string }>({
    defaultValues: {
      bahaCode: "",
    },
  });

  const handleSubmit = useMemo(
    () =>
      rhfSubmit((values) => {
        return onSubmit(values.bahaCode);
      }),
    [onSubmit, rhfSubmit]
  );

  useEffect(() => {
    reset({ bahaCode: defaultBahaCode });
  }, [defaultBahaCode, reset]);

  return (
    <Modal {...modalProps}>
      <ModalDialog variant="outlined" role="alertdialog">
        <form onSubmit={handleSubmit}>
          <DialogTitle>修改模板原始碼</DialogTitle>
          <Divider />
          <DialogContent>
            <Alert color="danger">
              修改模板的原始碼會套用在全部使用此模板的區塊上，在改動前建議先備份角色卡，修改時也多加小心。
            </Alert>

            <FormControl required>
              <FormLabel>原始碼</FormLabel>
              <Textarea
                minRows={10}
                maxRows={20}
                {...register("bahaCode", { required: true })}
              />
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button variant="solid" color="danger" type="submit">
              提交
            </Button>
          </DialogActions>
        </form>
      </ModalDialog>
    </Modal>
  );
};

export default EditTemplateModal;
