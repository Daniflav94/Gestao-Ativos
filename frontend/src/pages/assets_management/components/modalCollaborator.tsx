import {
  useForm,
} from "react-hook-form";
import { CustomInput } from "../../../components/customInput";
import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";
import { Button } from "@nextui-org/react";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";
import { useEffect } from "react";
import { normalizePhoneNumber } from "../../../mask/mask";

interface Props {
  asset?: IAssets;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ICollaborators) => void;
}

export function ModalCollaborator({
  isOpen,
  onOpenChange,
  onSubmit,
}: Props) {
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<ICollaborators>();

  const phoneValue = watch("phone");

  useEffect(() => {
    setValue("phone", normalizePhoneNumber(phoneValue));
  }, [phoneValue]);

  useEffect(() => {
    reset();
  }, [])

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle="Cadastrar colaborador"
    >
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          type="text"
          label="Nome"
          color={errors.name ? "danger" : "default"}
          control={control}
          name={"name"}
          refs={register("name")}
          isRequired
        />

        <CustomInput
          type="email"
          label="Email"
          color={errors.email ? "danger" : "default"}
          control={control}
          name={"email"}
          refs={register("email")}
          isRequired
        />

        <CustomInput
          type="tel"
          label="Telefone"
          color={errors.phone ? "danger" : "default"}
          control={control}
          name={"phone"}
          refs={register("phone")}
          isRequired
        />

        <Button
          type="submit"
          color="primary"
          className="text-slate-50 w-full my-5"
        >
          Cadastrar
        </Button>
      </S.Form>
    </CustomModal>
  );
}
