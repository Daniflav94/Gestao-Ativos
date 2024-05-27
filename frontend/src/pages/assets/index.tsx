import * as S from "./styles";
import { TableComponent } from "./components/table";
import { Toaster } from "sonner";
import { ModalAsset } from "./components/modalAsset";
import useAssets from "./useAssets";

export function Assets() {
  const {
    assetsList,
    listAllAssets,
    total,
    handleListAssets,
    isLoading,
    isLoadingFile,
    filename,
    isModalOpen,
    setIsModalOpen,
    assetEdit,
    setAssetEdit,
    handleFile,
    setCanAllocated,
    purchaseDateValue,
    setPurchaseDateValue,
    closingGuaranteeValue,
    setClosingGuaranteeValue,
    errorDate,
    convertDate,
    onSubmit,
    handleSubmit,
    control,
    register,
    setValue,
    reset,
    watch,
    errors,
  } = useAssets();

  return (
    <S.Container>
      <S.Header>
        <S.Title>ATIVOS</S.Title>
        <S.Subtitle>Listagem de ativos cadastrados</S.Subtitle>
      </S.Header>

      <TableComponent
        assetsList={assetsList}
        listComplete={listAllAssets}
        total={total}
        handleListAssets={handleListAssets}
        isLoading={isLoading}
        setIsModalOpen={setIsModalOpen}
        setAssetEdit={setAssetEdit}
      />

      <ModalAsset
        asset={assetEdit}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={onSubmit}
        handleFile={handleFile}
        handleSubmit={handleSubmit}
        control={control}
        register={register}
        setValue={setValue}
        reset={reset}
        watch={watch}
        errors={errors}
        isLoadingFile={isLoadingFile}
        filename={filename}
        setCanAllocated={setCanAllocated}
        purchaseDateValue={purchaseDateValue}
        setPurchaseDateValue={setPurchaseDateValue}
        closingGuaranteeValue={closingGuaranteeValue}
        setClosingGuaranteeValue={setClosingGuaranteeValue}
        errorDate={errorDate}
        convertDate={convertDate}
      />
      <Toaster position="top-right" richColors />
    </S.Container>
  );
}
