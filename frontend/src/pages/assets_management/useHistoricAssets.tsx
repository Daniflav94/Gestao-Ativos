import { useEffect, useState } from "react";
import { IAssetsHistoric } from "../../interfaces/IAssetsHistoric.interface";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { IAssets } from "../../interfaces/IAssets.interface";
import {
  createAssetHistoric,
  listAllHistoricAssets,
  listLastHistoric,
} from "../../services/assetsHistoric.service";
import { listAll } from "../../services/asset.service";
import { listAllCollaborators } from "../../services/collaborators.service";
import { toast } from "sonner";
import { useFilter } from "@react-aria/i18n";
import { parseDate } from "@internationalized/date";

interface Select {
  value: string;
  label: string;
  data: ICollaborators | IAssets;
}

interface Status {
  value: string;
  label: string;
}

const useHistoricAssets = () => {
  const [lastAssetsHistoric, setLastAssetsHistoric] = useState<
    IAssetsHistoric[]
  >([]);
  const [data, setData] = useState<IAssetsHistoric>();
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
  const [dateRegister, setDateRegister] = useState(
    data ? parseDate(convertDate(data.dateRegister)) : undefined
  );

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

  const [listStatus, setListStatus] = useState<Status[]>([
    { label: "Disponível", value: "Disponível" },
    { label: "Alocado", value: "Alocado" },
    { label: "Manutenção", value: "Manutenção" },
    { label: "Desabilitado", value: "Desabilitado" },
  ]);


  const { startsWith } = useFilter({ sensitivity: "base" });

  const handleSelectionAssetChange = (key: any) => {
    setFieldStateAsset((prevState) => {
      let selectedItem = prevState.items.find((option) => option.value === key);
      const assetSelected = assetsAvailable.filter((item) =>
        startsWith(item.label, selectedItem?.label || "")
      )

      const newArrayStatus = listStatus.filter((status) =>
        assetSelected[0].data.status !== status.label
      );
      console.log(newArrayStatus)
  
      setListStatus(
        newArrayStatus.map((status) => {
          return { value: status.value, label: status.label };
        })
      );

      return {
        inputValue: selectedItem?.label || "",
        selectedKey: key,
        items: assetSelected
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

  useEffect(() => {
    
  }, [fieldStateAsset.items.length > 0]);

  function convertDate(dateString: Date) {
    const splitDate = dateString.toLocaleDateString().split("/");

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
      const formatAssets = res.data.map(
        (asset: { idClient: any; description: any }) => {
          return {
            value: asset.idClient,
            label: `${asset.idClient} - ${asset.description}`,
            data: asset,
          };
        }
      );
      setAssetsAvailable(formatAssets);
    }
  };

  const handleListCollaborators = async () => {
    const res = await listAllCollaborators();

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

    const newAllocation: IAssetsHistoric = {
      assetId: asset?.data.id as string,
      collaboratorId: collaborator?.data.id as string,
      dateRegister: new Date(data.dateRegister),
      observation: data.observation,
      status: "Alocado",
      createdAt: new Date().toLocaleDateString(),
    };

    const res = await createAssetHistoric(
      JSON.parse(JSON.stringify(newAllocation))
    );

    if (!res.error) {
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

  return {
    handleSelectionAssetChange,
    handleSelectionCollaboratorChange,
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
    listStatus,
  };
};

export default useHistoricAssets;
