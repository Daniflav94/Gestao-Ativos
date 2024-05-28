import { SubmitHandler, useForm } from "react-hook-form";
import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  DatePicker,
  Textarea,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { IAssetsHistoric } from "../../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";
import {
  parseDate,
  CalendarDate,
  getLocalTimeZone,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { CustomSelect } from "../../../components/customSelect";
import { useFilter } from "@react-aria/i18n";

interface Props {
  data?: IAssetsHistoric;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assetsAvailable: Select[];
  collaborators: Select[];
  handleCreateAssetHistoric: (data: IAssetsHistoric) => void;
  dateRegister?: CalendarDate;
  setDateRegister?: (date: CalendarDate | undefined) => void;
  convertDate: (dateString: Date) => string;
  statusSelected: Set<never>;
  setStatusSelected: React.Dispatch<React.SetStateAction<Set<never>>>;
  setFieldStateAsset: React.Dispatch<
    React.SetStateAction<{
      selectedKey: string;
      inputValue: string;
      items: Select[];
    }>
  >;
  setFieldStateCollaborator: React.Dispatch<
    React.SetStateAction<{
      selectedKey: string;
      inputValue: string;
      items: Select[];
    }>
  >;
}

interface Select {
  value: string;
  label: string;
  data: ICollaborators | IAssets;
}

interface Status {
  value: string;
  label: string;
}

export function ModalNewHistoric({
  data,
  isOpen,
  onOpenChange,
  assetsAvailable,
  collaborators,
  handleCreateAssetHistoric,
  dateRegister,
  setDateRegister,
  convertDate,
  setFieldStateAsset,
  setFieldStateCollaborator,
  statusSelected,
  setStatusSelected,
}: Props) {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IAssetsHistoric>();

  const [errorDate, setErrorDate] = useState("");
  const [assetSelected, setAssetSelected] = useState("");
  const [listStatus, setListStatus] = useState<Status[]>([]);
  const status = [
    { label: "Disponível", value: "Disponível" },
    { label: "Alocado", value: "Alocado" },
    { label: "Manutenção", value: "Manutenção" },
    { label: "Desabilitado", value: "Desabilitado" },
  ];

  const [disabledCollaborators, setDisabledCollaborators] = useState(true);

  const { startsWith } = useFilter({ sensitivity: "base" });

  const handleStatus = (key: any) => {
    handleSelectionAssetChange(key);
    setAssetSelected(key);

    const asset = assetsAvailable.find((item) => item.value === key);

    if (asset) {
      const newArrayStatus = status.filter(
        (status) => asset?.data.status !== status.label
      );

      setListStatus(
        newArrayStatus.map((status) => {
          return { value: status.value, label: status.label };
        })
      );
    } else {
      setListStatus(status);
    }
  };

  const handleSelectionAssetChange = (key: any) => {
    setFieldStateAsset((prevState) => {
      let selectedItem = prevState.items.find((option) => option.value === key);

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: assetsAvailable.filter((item) =>
          startsWith(item.value, selectedItem?.value || "")
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
    if (!data.dateRegister) {
      setErrorDate("Preencha este campo");

      return;
    }

    handleCreateAssetHistoric(data);
    reset();
  };

  useEffect(() => {
    if (dateRegister) {
      setValue(
        "dateRegister",
        (dateRegister as CalendarDate).toDate(getLocalTimeZone())
      );
    }
  }, [dateRegister]);

  useEffect(() => {
    statusSelected.forEach((value: string) => {
      value !== "Alocado"
        ? setDisabledCollaborators(true)
        : setDisabledCollaborators(false);
    });
  }, [statusSelected]);

  useEffect(() => {
    setErrorDate("");
    setAssetSelected("");
    setDisabledCollaborators(true);
    setListStatus(status);
  }, [isOpen]);

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle="Nova ocorrência"
    >
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <I18nProvider locale="pt-BR">
          <DatePicker
            label="Data da ocorrência"
            variant="bordered"
            minValue={new CalendarDate(1950, 1, 1)}
            value={dateRegister}
            defaultValue={data && parseDate(convertDate(data.dateRegister))}
            onChange={setDateRegister}
            isRequired
            isInvalid={errorDate && !dateRegister ? true : false}
            errorMessage={errorDate && !dateRegister && errorDate}
            color={errors.dateRegister ? "danger" : "default"}
            size="sm"
          />
        </I18nProvider>

        <Autocomplete
          defaultItems={assetsAvailable}
          label="Ativo"
          placeholder="Busque pelo ativo"
          isRequired
          className="w-full"
          variant="bordered"
          onSelectionChange={(value) => handleStatus(value)}
        >
          {(asset) => (
            <AutocompleteItem key={asset.value}>{asset.label}</AutocompleteItem>
          )}
        </Autocomplete>

        <CustomSelect
          listItems={listStatus}
          label="Status"
          onChange={(value) => {
            setStatusSelected(value);
          }}
          isDisabled={assetSelected === ""}
        />

        <Autocomplete
          defaultItems={collaborators}
          label="Colaborador"
          placeholder="Busque pelo nome do colaborador"
          className="w-full"
          variant="bordered"
          onSelectionChange={(value) =>
            handleSelectionCollaboratorChange(value)
          }
          isDisabled={disabledCollaborators}
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
          defaultValue={data?.observation}
        />

        <Button
          type="submit"
          color="primary"
          className="text-slate-50 w-full my-5"
        >
          {data ? "Editar" : "Cadastrar"}
        </Button>
      </S.Form>
    </CustomModal>
  );
}
