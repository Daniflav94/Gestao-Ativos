import { useEffect, useState } from "react";
import * as S from "./styles";
import { IAssets } from "../../interfaces/IAssets.interface";
import { TableManagement } from "./components/tableManagement";
import { SubmitHandler } from "react-hook-form";
import { Toaster, toast } from "sonner";
import { editAsset, listAll } from "../../services/asset.service";
import { ModalCollaborator } from "./components/modalCollaborator";
import { ModalNewHistoric } from "./components/modalNewHistoric";
import { IAssetsHistoric } from "../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import {
  createAssetHistoric,
  listAllHistoricAssets,
  listLastHistoric,
} from "../../services/assetsHistoric.service";
import {
  createCollaborator,
  listAllCollaborators,
} from "../../services/collaborators.service";
import { ModalMoreInfoAsset } from "./components/modalMoreInfoAsset";
import { ModalMoreInfoCollaborator } from "./components/modalMoreInfoCollaborator";

interface Select {
  value: string;
  label: string;
  data: ICollaborators | IAssets;
}

export function AssetsManagement() {
  const [lastAssetsHistoric, setLastAssetsHistoric] = useState<IAssetsHistoric[]>([]);

  const [historicAssetsList, setHistoricAssetsList] = useState<
    IAssetsHistoric[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalNewCollaboratorOpen, setIsModalNewCollaboratorOpen] =
    useState(false);
  const [isModalNewHistoricOpen, setIsModalNewHistoricOpen] = useState(false);
  const [isModalInfoAssetOpen, setIsModalInfoAssetOpen] = useState(false);
  const [isModalInfoCollaboratorOpen, setIsModalInfoCollaboratorOpen] =
    useState(false);
  // const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [assetsAvailable, setAssetsAvailable] = useState<Select[]>([]);
  const [collaborators, setCollaborators] = useState<Select[]>([]);
  const [viewInfoAsset, setViewInfoAsset] = useState<IAssets>();
  const [viewInfoCollaborator, setViewInfoCollaborator] =
    useState<ICollaborators>();

  useEffect(() => {
    handleListAllHistoricAssets();
    handleListAssets();
    handleListCollaborators();
  }, []);

  const openModalInfo = (data: IAssets | ICollaborators, type: string) => {
    if (type === "asset") {
      setViewInfoAsset(data as IAssets);
      setIsModalInfoAssetOpen(true);
    } else {
      setViewInfoCollaborator(data as ICollaborators);
      setIsModalInfoCollaboratorOpen(true);
    }
  };

  const handleListAllHistoricAssets = async () => {
    setIsLoading(true);
    const res = await listLastHistoric();
    const listComplete = await listAllHistoricAssets();

    if (res.data) {
      setLastAssetsHistoric(res.data);
      setTotal(res.total);
    } else {
      setLastAssetsHistoric([]);
    }

    if (listComplete.data) {
      setHistoricAssetsList(listComplete.data);
    }
    setIsLoading(false);
  };

  const handleListAssets = async () => {
    const res = await listAll();

    if (res.data) {
      const formatAssets = res.data.map((asset) => {
        return {
          value: asset.idClient,
          label: `${asset.idClient} - ${asset.description}`,
          data: asset,
        };
      });
      setAssetsAvailable(formatAssets);
    }
  };

  const handleListCollaborators = async () => {
    const res = await listAllCollaborators();

    if (res.data) {
      const formatCollaborators = res.data.map((collaborator) => {
        return {
          value: collaborator.name,
          label: collaborator.name,
          data: collaborator,
        };
      });

      setCollaborators(formatCollaborators);
    }
  };


  const handleCreateAllocation = async (data: IAssetsHistoric) => {
    const res = await createAssetHistoric(JSON.parse(JSON.stringify(data)));

    const resEditAsset = await editAsset(data.asset.uidAsset as string, {
      status: "Alocado",
    });

    if (!res.error && !resEditAsset.error) {
      toast.success("Ativo cadastrado com sucesso!");

      handleListAllHistoricAssets();
      handleListAssets();
      setIsModalNewHistoricOpen(false);
    } else {
      toast.error(
        "Ocorreu um erro ao alocar ativo. Tente novamente mais tarde."
      );
    }
  };

  const onSubmitCollaborator: SubmitHandler<ICollaborators> = async (data) => {
    const newCollaborator: ICollaborators = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: true,
    };

    const res = await createCollaborator(newCollaborator);

    if (!res.error) {
      toast.success("Colaborador cadastrado com sucesso!");

      handleListCollaborators();
      setIsModalNewCollaboratorOpen(false);
    } else {
      toast.error(
        "Ocorreu um erro ao cadastrar colaborador. Tente novamente mais tarde."
      );
    }
  };

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
        handleCreateAllocation={handleCreateAllocation}
      />

      <ModalCollaborator
        isOpen={isModalNewCollaboratorOpen}
        onOpenChange={setIsModalNewCollaboratorOpen}
        onSubmit={onSubmitCollaborator}
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
