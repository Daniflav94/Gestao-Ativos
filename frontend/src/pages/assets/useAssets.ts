import { useEffect, useState } from "react";
import { IAssets } from "../../interfaces/IAssets.interface";
import { useForm, SubmitHandler } from "react-hook-form";
import { upload } from "../../services/uploadStorage.service";
import { toast } from "sonner";
import {
  createAsset,
  deleteAsset,
  listAll,
  listAllWithPagination,
} from "../../services/asset.service";
import { parseDate, getLocalTimeZone } from "@internationalized/date";

const useAssets = () => {
  const {
    handleSubmit,
    watch,
    setValue,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<IAssets>();

  const [assetsList, setAssetsList] = useState<IAssets[]>([]);
  const [assetEdit, setAssetEdit] = useState<IAssets>();
  const [listAllAssets, setListAllAssets] = useState<IAssets[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingFile, setIsLoadingFile] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fileInvoice, setFileInvoice] = useState("");
  const [filename, setFilename] = useState("");
  const [status, setStatus] = useState(new Set([]));
  const [canAllocated, setCanAllocated] = useState(new Set([]));
  const [purchaseDateValue, setPurchaseDateValue] = useState(
    assetEdit ? parseDate(convertDate(assetEdit.purchaseDate)) : undefined
  );

  const [closingGuaranteeValue, setClosingGuaranteeValue] = useState(
    assetEdit ? parseDate(convertDate(assetEdit.closingGuarantee)) : undefined
  );
  const [errorDate, setErrorDate] = useState("");

  useEffect(() => {
    handleListAssets(0);
  }, []);

  useEffect(() => {
    if (purchaseDateValue) {
      setValue(
        "purchaseDate",
        purchaseDateValue.toDate(getLocalTimeZone()).toLocaleDateString()
      );
    }

    if (closingGuaranteeValue) {
      setValue(
        "closingGuarantee",
        closingGuaranteeValue.toDate(getLocalTimeZone()).toLocaleDateString()
      );
    }
  }, [purchaseDateValue, closingGuaranteeValue]);

  function convertDate(dateString: string) {
    const splitDate = dateString.split("/");

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

  const handleFile = async (event: any) => {
    const filename = event.target.files[0];
    setIsLoadingFile(true);
    const file = await upload(event.target.files[0], filename.name);
    if (file) {
      setFilename(filename.name);
      setFileInvoice(file);
      setIsLoadingFile(false);
    }
  };

  const handleListAssets = async (page: number) => {
    setIsLoading(true);
    const res = await listAllWithPagination(page);
    const listComplete = await listAll();

    if (res.data) {
      setAssetsList(res.data);
      setTotal(res.total);
    } else {
      setAssetsList([]);
    }

    if (listComplete.data) {
      setListAllAssets(listComplete.data);
    }
    setIsLoading(false);
  };

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const onSubmit: SubmitHandler<IAssets> = async (data) => {
    const isAssetExist = assetsList.some(
      (asset) => data.idClient === asset.idClient
    );

    if (isAssetExist) {
      return toast.error("Id já cadastrado!");
    }
    if (!data.purchaseDate || !data.closingGuarantee) {
      setErrorDate("Preencha este campo");

      return;
    }

    status.forEach((value) => {
      setValue("status", value);
    });

    canAllocated.forEach((value) => {
      value === "Sim"
        ? setValue("canAllocated", true)
        : setValue("canAllocated", false);
    });

    const newAsset: IAssets = {
      idClient: data.idClient,
      description: capitalize(data.description),
      closingGuarantee: data.closingGuarantee,
      purchaseDate: data.purchaseDate,
      observation: data.observation,
      supplier: data.supplier,
      canAllocated: watch("canAllocated"),
      status: watch("status"),
      invoice: fileInvoice,
    };

    const res = await createAsset(JSON.parse(JSON.stringify(newAsset)));

    if (res) {
      toast.success("Ativo cadastrado com sucesso!");

      handleListAssets(0);
      setIsModalOpen(false);

      reset();
      setFileInvoice("");
      setFilename("");
      setPurchaseDateValue(undefined);
      setClosingGuaranteeValue(undefined);
    } else {
      toast.error("Ocorreu um erro ao cadastrar. Tente novamente mais tarde.");
    }
  };

  const removeAsset = async (id: string) => {
    const res = await deleteAsset(id);

    if (res?.error) {
      return toast.error(res.error);
    }

    handleListAssets(0);
  };

  return {
    assetsList,
    listAllAssets,
    total,
    handleListAssets,
    isLoading,
    isLoadingFile,
    filename,
    isModalOpen,
    setIsModalOpen,
    removeAsset,
    assetEdit,
    setAssetEdit,
    handleFile,
    setStatus,
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
  };
};

export default useAssets;
