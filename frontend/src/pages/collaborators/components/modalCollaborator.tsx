import { useForm } from "react-hook-form";
import { CustomInput } from "../../../components/customInput";
import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";
import { Button } from "@nextui-org/react";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";
import { useEffect } from "react";
import { normalizePhoneNumber } from "../../../mask/mask";
import { CustomSelect } from "../../../components/customSelect";

interface Props {
  asset?: IAssets;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: ICollaborators) => void;
  collaborator?: ICollaborators;
  setStatusSelected: React.Dispatch<React.SetStateAction<Set<never>>>;
}

export function ModalCollaborator({
  isOpen,
  onOpenChange,
  onSubmit,
  collaborator,
  setStatusSelected,
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

    if (collaborator) {
      setValue("phone", collaborator.phone);
    }
  }, [isOpen, collaborator]);

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle={collaborator ? "Editar Colaborador" : "Cadastrar colaborador"}
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
          defaultValue={collaborator?.name}
        />

        <CustomInput
          type="email"
          label="Email"
          color={errors.email ? "danger" : "default"}
          control={control}
          name={"email"}
          refs={register("email")}
          isRequired
          defaultValue={collaborator?.email}
        />

        <CustomInput
          type="tel"
          label="Telefone"
          color={errors.phone ? "danger" : "default"}
          control={control}
          name={"phone"}
          refs={register("phone")}
          isRequired
          defaultValue={collaborator?.phone}
        />

        {collaborator && (
          <CustomSelect
            label="Status"
            listItems={[
              { value: "Ativo", label: "Ativo" },
              { value: "Desativado", label: "Desativado" },
            ]}
            onChange={(value) => {
              setStatusSelected(value);
            }}
            isRequired
            placeholder={collaborator?.status}
            defaultSelectedKeys={[collaborator?.status]}
          />
        )}

        <Button
          type="submit"
          color="primary"
          className="text-slate-50 w-full my-5"
        >
          {collaborator ? "Editar" : "Cadastrar"}
        </Button>
      </S.Form>
    </CustomModal>
  );
}
