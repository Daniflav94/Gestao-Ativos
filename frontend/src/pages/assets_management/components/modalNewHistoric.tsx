import { SubmitHandler, useForm } from "react-hook-form";
import { CustomInput } from "../../../components/customInput";
import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  Textarea,
} from "@nextui-org/react";
import { useEffect, useState } from "react";
import { IAssetsHistoric } from "../../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";
import { useFilter } from "@react-aria/i18n";

interface Props {
  asset?: IAssetsHistoric;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assetsAvailable: Select[];
  collaborators: Select[];
  handleCreateAllocation: (data: IAssetsHistoric) => void;
}

interface Select {
  value: string;
  label: string;
  data: ICollaborators | IAssets;
}

export function ModalNewHistoric({
  asset,
  isOpen,
  onOpenChange,
  assetsAvailable,
  collaborators,
  handleCreateAllocation,
}: Props) {
 
  const {
    handleSubmit,
    setValue,
    register,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<IAssetsHistoric>();

  const dateValue = watch("dateRegister");

  useEffect(() => {
    //setValue("dateAllocation", normalizeDate(dateValue));
  }, [dateValue]);

  const [fieldStateAsset, setFieldStateAsset] = useState({
    selectedKey: "",
    inputValue: "",
    items: assetsAvailable,
  });

  const [fieldStateCollaborator, setFieldStateCollaborator] = useState({
    selectedKey: "",
    inputValue: "",
    items: collaborators,
  });

  const { startsWith } = useFilter({ sensitivity: "base" });

  const handleSelectionAssetChange = (key: any) => {
    setFieldStateAsset((prevState) => {
      let selectedItem = prevState.items.find((option) => option.value === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: assetsAvailable.filter((item) =>
          startsWith(item.label, selectedItem?.label || "")
        ),
      };
    });
  };

  const handleSelectionCollaboratorChange = (key: any) => {
    setFieldStateCollaborator((prevState) => {
      let selectedItem = prevState.items.find((option) => option.value === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: collaborators.filter((item) =>
          startsWith(item.label, selectedItem?.label || "")
        ),
      };
    });
  };

  const onSubmit: SubmitHandler<IAssetsHistoric> = async (data) => {
    const asset = assetsAvailable.find((item) => {
      if (item.value === fieldStateAsset.selectedKey) {
        return item;
      }
    });

    const collaborator = collaborators.find((item) => {
      if (item.label === fieldStateCollaborator.selectedKey) {
        return item;
      }
    });

    const newAllocation: IAssetsHistoric = {
      asset: asset?.data as IAssets,
      collaborator: collaborator?.data as ICollaborators,
      dateRegister: new Date(data.dateRegister).toLocaleDateString(),
      observation: data.observation,
      status: "Alocado",
      createdBy: "",
      createdAt: new Date().toLocaleDateString()
    };

    handleCreateAllocation(newAllocation);
    reset();
  };

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle="Alocar ativo"
    >
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          type="date"
          label="Data alocação"
          color={errors.dateRegister ? "danger" : "default"}
          control={control}
          name={"dateRegister"}
          refs={register("dateRegister")}
          isInvalid={errors.dateRegister}
          errorMessage={errors.dateRegister?.message}
          isRequired
        />

        <Autocomplete
          defaultItems={assetsAvailable}
          label="Ativo"
          placeholder="Busque pelo ativo"
          isRequired
          className="w-full"
          variant="bordered"
          onSelectionChange={(value) => handleSelectionAssetChange(value)}
        >
          {(asset) => (
            <AutocompleteItem key={asset.value}>{asset.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <Autocomplete
          defaultItems={collaborators}
          label="Colaborador"
          placeholder="Busque pelo nome do colaborador"
          className="w-full"
          variant="bordered"
          isRequired
          onSelectionChange={(value) =>
            handleSelectionCollaboratorChange(value)
          }
        >
          {(collaborator) => (
            <AutocompleteItem key={collaborator.value}>
              {collaborator.label}
            </AutocompleteItem>
          )}
        </Autocomplete>

        <Textarea
          label="Observações"
          variant="bordered"
          minRows={2}
          onChange={(e) => setValue("observation", e.target.value)}
          defaultValue={asset?.observation}
        />

        <Button
          type="submit"
          color="primary"
          className="text-slate-50 w-full my-5"
        >
          {asset ? "Editar" : "Cadastrar"}
        </Button>
      </S.Form>
    </CustomModal>
  );
}
