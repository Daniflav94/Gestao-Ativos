import {
  Control,
  FieldErrors,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormReset,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import { CustomInput } from "../../../components/customInput";
import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";
import { CustomSelect } from "../../../components/customSelect";
import { Button, DatePicker, Spinner, Textarea } from "@nextui-org/react";
import { useEffect } from "react";
import {
  parseDate,
  getLocalTimeZone,
  CalendarDate,
  today,
} from "@internationalized/date";
import { I18nProvider } from "@react-aria/i18n";

interface Props {
  asset?: IAssets;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: IAssets) => void;
  handleFile: (event: any) => void;
  handleSubmit: UseFormHandleSubmit<IAssets, undefined>;
  register: UseFormRegister<IAssets>;
  control: Control<IAssets, any>;
  setValue: UseFormSetValue<IAssets>;
  watch: UseFormWatch<IAssets>;
  reset: UseFormReset<IAssets>;
  errors: FieldErrors<IAssets>;
  isLoadingFile: boolean;
  filename: string;
  setCanAllocated: React.Dispatch<React.SetStateAction<Set<never>>>;
  purchaseDateValue?: CalendarDate;
  closingGuaranteeValue?: CalendarDate;
  setPurchaseDateValue: React.Dispatch<React.SetStateAction<CalendarDate | undefined>>;
  setClosingGuaranteeValue: React.Dispatch<React.SetStateAction<CalendarDate | undefined>>
  convertDate: (date: Date) => string;
  errorDate?: string;
}

export function ModalAsset({
  asset,
  isOpen,
  onOpenChange,
  onSubmit,
  handleFile,
  handleSubmit,
  register,
  control,
  errors,
  reset,
  setValue,
  isLoadingFile,
  filename,
  setCanAllocated,
  purchaseDateValue,
  setPurchaseDateValue,
  closingGuaranteeValue,
  setClosingGuaranteeValue,
  convertDate,
  errorDate,
}: Props) {
  useEffect(() => {
    reset();
  }, []);

  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle="Cadastrar ativo"
    >
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <CustomInput
          type="text"
          label="Id"
          color={errors.idClient ? "danger" : "default"}
          control={control}
          name={"idClient"}
          refs={register("idClient")}
          isRequired
          defaultValue={asset?.idClient}
        />

        <CustomInput
          type="text"
          label="Descrição"
          color={errors.description ? "danger" : "default"}
          control={control}
          name={"description"}
          refs={register("description")}
          isRequired
          defaultValue={asset?.description}
        />

        <S.DualInput>
          <I18nProvider locale="pt-BR">
            <DatePicker
              label="Data da compra"
              variant="bordered"
              minValue={new CalendarDate(1950, 1, 1)}
              maxValue={today(getLocalTimeZone())}
              value={purchaseDateValue}
              defaultValue={asset && parseDate(convertDate(asset.purchaseDate))}
              onChange={setPurchaseDateValue}
              isInvalid={errorDate && !purchaseDateValue ? true : false}
              errorMessage={errorDate && !purchaseDateValue && errorDate}
              isRequired
              color={errors.purchaseDate ? "danger" : "default"}
              size="sm"
            />
          </I18nProvider>

          <I18nProvider locale="pt-BR">
            <DatePicker
              label="Encerramento garantia"
              variant="bordered"
              minValue={new CalendarDate(1950, 1, 1)}
              value={closingGuaranteeValue}
              defaultValue={
                asset && parseDate(convertDate(asset.closingGuarantee))
              }
              onChange={setClosingGuaranteeValue}
              isRequired
              isInvalid={errorDate && !closingGuaranteeValue ? true : false}
              errorMessage={errorDate && !closingGuaranteeValue && errorDate}
              color={errors.closingGuarantee ? "danger" : "default"}
              size="sm"
            />
          </I18nProvider>
        </S.DualInput>

        <CustomInput
          type="text"
          label="Fornecedor"
          color={errors.supplier ? "danger" : "default"}
          control={control}
          name={"supplier"}
          refs={register("supplier")}
          isRequired
          defaultValue={asset?.supplier}
        />
        {!asset ? (
            <CustomSelect
              listItems={[
                { value: "Sim", label: "Sim" },
                { value: "Não", label: "Não" },
              ]}
              label="Pode ser alocado?"
              onChange={(value) => {
                setCanAllocated(value);
              }}
            />

        ) : (
          <CustomSelect
            listItems={[
              { value: "Sim", label: "Sim" },
              { value: "Não", label: "Não" },
            ]}
            label="Pode ser alocado?"
            onChange={(value) => setCanAllocated(value)}
            placeholder={asset.canAllocated === true ? "Sim" : "Não"}
          />
        )}

        <S.InputFile>
          <S.ContentInputFile>
            <span>Nota fiscal </span>
            <label>
              <S.ButtonFile>Escolher arquivo</S.ButtonFile>
              {isLoadingFile ? (
                <Spinner size="sm" color="primary" className="ms-2" />
              ) : (
                <span className="ms-2">{filename}</span>
              )}
              <input
                type="file"
                onChange={handleFile}
                style={{ display: "none" }}
              />
            </label>
          </S.ContentInputFile>
        </S.InputFile>

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
