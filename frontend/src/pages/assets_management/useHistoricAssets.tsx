import { useEffect, useState } from "react";
import { IAssetsHistoric } from "../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { IAssets } from "../../interfaces/IAssets.interface";
import {
  createAssetHistoric,
  editRegisterHistoric,
  listAllHistoricAssets,
  listLastHistoric,
} from "../../services/assetsHistoric.service";
import { listAll } from "../../services/asset.service";
import { listActiveCollaborators } from "../../services/collaborators.service";
import { toast } from "sonner";
import { CalendarDate, parseDate } from "@internationalized/date";

interface Select {
  value: string;
  label: string;
  data: ICollaborators | IAssets;
}

const useHistoricAssets = () => {
  const [lastAssetsHistoric, setLastAssetsHistoric] = useState<
    IAssetsHistoric[]
  >([]);
  const [historicEditing, setHistoricEditing] = useState<IAssetsHistoric>();
  const [historicAssetsList, setHistoricAssetsList] = useState<
    IAssetsHistoric[]
  >([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalNewHistoricOpen, setIsModalNewHistoricOpen] = useState(false);
  const [isModalInfoAssetOpen, setIsModalInfoAssetOpen] = useState(false);
  const [isModalInfoCollaboratorOpen, setIsModalInfoCollaboratorOpen] =
    useState(false);
  const [assetsAvailable, setAssetsAvailable] = useState<Select[]>([]);
  const [collaborators, setCollaborators] = useState<Select[]>([]);
  const [viewInfoAsset, setViewInfoAsset] = useState<IAssets>();
  const [viewInfoCollaborator, setViewInfoCollaborator] =
    useState<ICollaborators>();
  const [dateRegister, setDateRegister] = useState<CalendarDate | undefined>(
    historicEditing
      ? parseDate(convertDate(historicEditing.dateRegister))
      : undefined
  );
  const [statusSelected, setStatusSelected] = useState(new Set([]));
  const [filteredData, setFilteredData] = useState<IAssetsHistoric[]>([]);

  useEffect(() => {
    handleListAllHistoricAssets();
    handleListAssets();
    handleListCollaborators();
  }, []);

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

  function convertDate(dateString: Date) {
    const splitDate = new Date(dateString)
      .toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })
      .split("/");

    const newDate = new Date(
      Number(splitDate[2]),
      Number(splitDate[1]) - 1,
      Number(splitDate[0])
    );

    const year = newDate.getFullYear();
    const month = newDate.getMonth() + 1;
    const day = newDate.getDate();

    const dateFormatted = `${year}-${month < 10 ? "0" : ""}${month}-${
      day < 10 ? "0" : ""
    }${day}`;

    return dateFormatted;
  }

  const openModalInfo = (data: IAssets | ICollaborators, type: string) => {
    if (type === "asset") {
      setViewInfoAsset(data as IAssets);
      setIsModalInfoAssetOpen(true);
    } else {
      setViewInfoCollaborator(data as ICollaborators);
      setIsModalInfoCollaboratorOpen(true);
    }
  };

  const openModal = async(type: string, data?: IAssetsHistoric) => {  
    const assets = await listAll();
    const collaborators = await listActiveCollaborators();

    if (type === "new") {
      if (assets.data.length > 0 && collaborators.data.length > 0) {
        setHistoricEditing(undefined);
        setIsModalNewHistoricOpen(true);
      }else {
        toast.warning("Você precisa cadastrar ativos e colaboradores antes de criar uma nova ocorrência!")
      }
    } else {
      setHistoricEditing(data);
      setIsModalNewHistoricOpen(true);
    }
  };

  const handleListAllHistoricAssets = async () => {
    setIsLoading(true);
    const res = await listLastHistoric();
    const listComplete = await listAllHistoricAssets();

    if (res.data) {
      const formatDate = res.data.map((item: IAssetsHistoric) => {
        return {
          ...item,
          dateRegister: new Date(item.dateRegister).toLocaleDateString(),
        };
      });
      setLastAssetsHistoric(formatDate);
      setTotal(res.total);
    } else {
      setLastAssetsHistoric([]);
    }

    if (listComplete.data) {
      const formatDate = listComplete.data.map((item: IAssetsHistoric) => {
        return {
          ...item,
          dateRegister: new Date(item.dateRegister).toLocaleDateString(),
        };
      });
      setHistoricAssetsList(formatDate);
    }
    setIsLoading(false);
  };

  const handleListAssets = async () => {
    const res = await listAll();
    if (res.data) {
      const formatAssets = res.data.map(
        (asset: { idClient: any; description: any }) => {
          return {
            value: `${asset.idClient} - ${asset.description}`,
            label: `${asset.idClient} - ${asset.description}`,
            data: asset,
          };
        }
      );
      setAssetsAvailable(formatAssets);
    }
  };

  const handleListCollaborators = async () => {
    const res = await listActiveCollaborators();

    if (res.data) {
      const formatCollaborators = res.data.map(
        (collaborator: { name: any }) => {
          return {
            value: collaborator.name,
            label: collaborator.name,
            data: collaborator,
          };
        }
      );

      setCollaborators(formatCollaborators);
    }
  };

  const updateHistoricAsset = async (
    data: IAssetsHistoric,
    assetId?: string,
    collaboratorId?: string,
    status?: string
  ) => {
    const edit: IAssetsHistoric = {
      assetId: assetId || (historicEditing?.assetId as string),
      collaboratorId:
        collaboratorId || (historicEditing?.collaboratorId as string),
      dateRegister: new Date(data.dateRegister),
      observation: data.observation,
      status: status || (historicEditing?.status as string),
    };

    const res = await editRegisterHistoric(historicEditing?.id as string, edit);

    if (!res.errors) {
      toast.success("Ativo editado!");

      handleListAllHistoricAssets();
      handleListAssets();
      setIsModalNewHistoricOpen(false);
      setDateRegister(undefined);
    } else {
      res.errors[0].msg
        ? toast.error(res.errors[0].msg)
        : toast.error(res.errors[0]);

      setDateRegister(undefined);
    }
  };

  const handleCreateAssetHistoric = async (data: IAssetsHistoric) => {
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

    let statusString = "";
    console.log("colaborador fieldstate", collaborator)

    statusSelected.forEach((value: string) => {
      value === "Alocado"
        ? (statusString = "Alocado")
        : value === "Manutenção"
        ? (statusString = "Manutenção")
        : value === "Disponível"
        ? (statusString = "Disponível")
        : value === "Desabilitado"
        ? (statusString = "Desabilitado")
        : null;
    });

    if (historicEditing) {
      updateHistoricAsset(
        data,
        asset?.data.id,
        collaborator?.data.id,
        statusString
      );

      return;
    }

    const newRegister: IAssetsHistoric = {
      assetId: asset?.data.id as string,
      collaboratorId: collaborator?.data.id as string,
      dateRegister: new Date(data.dateRegister),
      observation: data.observation,
      status: statusString,
      createdAt: new Date().toLocaleDateString(),
    };
    console.log(newRegister)

    const res = await createAssetHistoric(
      JSON.parse(JSON.stringify(newRegister))
    );

    if (!res.errors) {
      toast.success("Ativo cadastrado com sucesso!");

      handleListAllHistoricAssets();
      handleListAssets();
      setIsModalNewHistoricOpen(false);
      setDateRegister(undefined);
      setFieldStateCollaborator({
        selectedKey: "",
        inputValue: "",
        items: collaborators,
      })
    } else {
      res.errors[0].msg
        ? toast.error(res.errors[0].msg)
        : toast.error(res.errors[0]);

      setDateRegister(undefined);
    }
  };

  return {
    historicEditing,
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
    openModal,
    dateRegister,
    setDateRegister,
    convertDate,
    statusSelected,
    setStatusSelected,
    filteredData,
    setFilteredData,
  };
};

export default useHistoricAssets;
