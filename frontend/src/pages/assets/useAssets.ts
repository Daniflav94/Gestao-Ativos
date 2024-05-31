import { useEffect, useState } from "react";
import { IAssets } from "../../interfaces/IAssets.interface";
import { useForm, SubmitHandler } from "react-hook-form";
import { toast } from "sonner";
import {
  createAsset,
  editAsset,
  editFile,
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
  const [fileInvoice, setFileInvoice] = useState();
  const [filename, setFilename] = useState("");
  const [canAllocated, setCanAllocated] = useState(new Set([]));
  const [purchaseDateValue, setPurchaseDateValue] = useState(
    assetEdit
      ? parseDate(convertDate(assetEdit.purchaseDate as Date))
      : undefined
  );

  const [closingGuaranteeValue, setClosingGuaranteeValue] = useState(
    assetEdit
      ? parseDate(convertDate(assetEdit.closingGuarantee as Date))
      : undefined
  );
  const [errorDate, setErrorDate] = useState("");

  useEffect(() => {
    handleListAssets(1);
  }, []);

  useEffect(() => {
    if (purchaseDateValue) {
      setValue("purchaseDate", purchaseDateValue.toDate(getLocalTimeZone()));
    }

    if (closingGuaranteeValue) {
      setValue(
        "closingGuarantee",
        closingGuaranteeValue.toDate(getLocalTimeZone())
      );
    }
  }, [purchaseDateValue, closingGuaranteeValue]);

  const openModal = (type: string, asset?: IAssets) => {
    if (type === "new") {
      setAssetEdit(undefined);
      setIsModalOpen(true);
    } else {
      setAssetEdit(asset);
      setIsModalOpen(true);
    }
  };

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

  const handleFile = async (event: any) => {
    setIsLoadingFile(true);
    const file = event.target.files[0];
    if (file) {
      setFilename(file.name);
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

  const handleUpdateAsset: SubmitHandler<IAssets> = async (data) => {
    canAllocated.forEach((value) => {
      value === "Sim"
        ? setValue("canAllocated", true)
        : setValue("canAllocated", false);
    });

    if (fileInvoice) {
      const newFile = {
        invoice: fileInvoice,
      };
      const formData = new FormData();
      const keys = Object.keys(newFile) as Array<keyof typeof newFile>;

      keys.forEach((key) => {
        formData.append(key, newFile[key] as string | Blob);
      });
      
      await editFile(assetEdit?.id as string, formData);

    }

    const edit: IAssets = {
      idClient: data.idClient,
      description: capitalize(data.description),
      closingGuarantee: new Date(data.closingGuarantee)
        .toISOString()
        .slice(0, 10),
      purchaseDate: new Date(data.purchaseDate).toISOString().slice(0, 10),
      observation: data.observation,
      supplier: data.supplier,
      canAllocated: watch("canAllocated"),
    };

    const res = await editAsset(assetEdit?.id as string, edit);

    if (!res.errors) {
      toast.success("Ativo editado!");

      handleListAssets(0);
      setIsModalOpen(false);

      reset();
      setFileInvoice(undefined);
      setFilename("");
      setPurchaseDateValue(undefined);
      setClosingGuaranteeValue(undefined);
    } else {
      res.errors[0].msg
        ? toast.error(res.errors[0].msg)
        : toast.error(res.errors[0]);
    }
  };

  const onSubmit: SubmitHandler<IAssets> = async (data) => {
    if (!assetEdit) {
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

      canAllocated.forEach((value) => {
        value === "Sim"
          ? setValue("canAllocated", true)
          : setValue("canAllocated", false);
      });

      const newAsset: IAssets = {
        idClient: data.idClient,
        description: capitalize(data.description),
        closingGuarantee: new Date(data.closingGuarantee)
          .toISOString()
          .slice(0, 10),
        purchaseDate: new Date(data.purchaseDate).toISOString().slice(0, 10),
        observation: data.observation,
        supplier: data.supplier,
        canAllocated: watch("canAllocated"),
        invoice: fileInvoice,
      };

      const formData = new FormData();
      const keys = Object.keys(newAsset) as Array<keyof typeof newAsset>;

      keys.forEach((key) => {
        formData.append(key, newAsset[key] as string | Blob);
      });

      const res = await createAsset(formData);

      if (!res.errors) {
        toast.success("Ativo cadastrado com sucesso!");

        handleListAssets(0);
        setIsModalOpen(false);

        reset();
        setFileInvoice(undefined);
        setFilename("");
        setPurchaseDateValue(undefined);
        setClosingGuaranteeValue(undefined);
      } else {
        res.errors[0].msg
          ? toast.error(res.errors[0].msg)
          : toast.error(res.errors[0]);
      }
    } else {
      handleUpdateAsset(data);
    }
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
    openModal,
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
  };
};

export default useAssets;
