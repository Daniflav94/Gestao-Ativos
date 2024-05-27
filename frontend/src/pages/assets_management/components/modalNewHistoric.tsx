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
import { useState } from "react";
import { IAssetsHistoric } from "../../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";
import { parseDate, CalendarDate } from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";
import { CustomSelect } from "../../../components/customSelect";

interface Props {
  data?: IAssetsHistoric;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  assetsAvailable: Select[];
  collaborators: Select[];
  handleCreateAssetHistoric: (data: IAssetsHistoric) => void;
  handleSelectionCollaboratorChange: (key: any) => void;
  handleSelectionAssetChange: (key: any) => void;
  dateRegister?: CalendarDate;
  setDateRegister?: React.Dispatch<
    React.SetStateAction<CalendarDate | undefined>
  >;
  convertDate: (dateString: Date) => string;
  listStatus: Status[];
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
  handleSelectionCollaboratorChange,
  handleSelectionAssetChange,
  dateRegister,
  setDateRegister,
  convertDate,
  listStatus,
}: Props) {
  const {
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<IAssetsHistoric>();

  const [errorDate, setErrorDate] = useState("");
  
  const onSubmit: SubmitHandler<IAssetsHistoric> = async (data) => {
    if (!data.dateRegister) {
      setErrorDate("Preencha este campo");

      return;
    }

    handleCreateAssetHistoric(data);
    reset();
  };

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

        <CustomSelect
          listItems={listStatus}
          label="Status"
          onChange={(value) => {
            console.log(value);
            setValue("status", value);
          }}
        />

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
