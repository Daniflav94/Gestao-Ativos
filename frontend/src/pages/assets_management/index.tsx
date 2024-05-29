import * as S from "./styles";
import { IAssets } from "../../interfaces/IAssets.interface";
import { TableManagement } from "./components/tableManagement";
import { Toaster } from "sonner";
import { ModalNewHistoric } from "./components/modalNewHistoric";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { ModalMoreInfoCollaborator } from "./components/modalMoreInfoCollaborator";
import useHistoricAssets from "./useHistoricAssets";
import { ModalMoreInfoAsset } from "./components/modalMoreInfoAsset";

export function AssetsManagement() {
  const {
    setFieldStateAsset,
    setFieldStateCollaborator,
    lastAssetsHistoric,
    historicAssetsList,
    total,
    isLoading,
    isModalNewHistoricOpen,
    isModalInfoAssetOpen,
    isModalInfoCollaboratorOpen,
    viewInfoAsset,
    viewInfoCollaborator,
    assetsAvailable,
    collaborators,
    openModalInfo,
    handleCreateAssetHistoric,
    setIsModalNewHistoricOpen,
    setIsModalInfoAssetOpen,
    setIsModalInfoCollaboratorOpen,
    dateRegister,
    setDateRegister,
    convertDate,
    statusSelected,
    setStatusSelected,
  } = useHistoricAssets();

  return (
    <S.Container>
      <S.Header>
        <S.Title>GESTÃO DE ATIVOS</S.Title>
        <S.Subtitle>Histórico de movimentações dos ativos</S.Subtitle>
      </S.Header>

      <TableManagement
        historicAssetsList={historicAssetsList}
        total={total}
        lastAssetsHistoric={lastAssetsHistoric}
        isLoading={isLoading}
        setIsModalNewHistoricOpen={setIsModalNewHistoricOpen}
        openModalInfo={openModalInfo}
      />

      <ModalNewHistoric
        isOpen={isModalNewHistoricOpen}
        onOpenChange={setIsModalNewHistoricOpen}
        assetsAvailable={assetsAvailable}
        collaborators={collaborators}
        handleCreateAssetHistoric={handleCreateAssetHistoric}
        setFieldStateAsset={setFieldStateAsset}
        setFieldStateCollaborator={setFieldStateCollaborator}
        dateRegister={dateRegister}
        setDateRegister={setDateRegister}
        convertDate={convertDate}
        statusSelected={statusSelected}
        setStatusSelected={setStatusSelected}
      />

      <ModalMoreInfoAsset
        isOpen={isModalInfoAssetOpen}
        onOpenChange={setIsModalInfoAssetOpen}
        data={viewInfoAsset as IAssets}
      />
      <ModalMoreInfoCollaborator
        isOpen={isModalInfoCollaboratorOpen}
        onOpenChange={setIsModalInfoCollaboratorOpen}
        data={viewInfoCollaborator as ICollaborators}
      />
      <Toaster position="top-right" richColors />
    </S.Container>
  );
}
