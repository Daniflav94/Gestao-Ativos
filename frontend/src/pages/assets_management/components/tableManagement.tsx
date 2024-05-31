import React, { useState } from "react";
import * as S from "../styles";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Spinner,
  Tooltip,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@nextui-org/table";
import { ChevronDown, Circle, Eye, PencilLine, Plus, Search } from "lucide-react";
import iconClose from "../../../assets/icons/fechar.png";
import { StatusAssets } from "../../../enums/statusAssets.enum";
import { IAssetsHistoric } from "../../../interfaces/IAssetsHistoric.interface";
import { IAssets } from "../../../interfaces/IAssets.interface";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";

interface Props {
  lastAssetsHistoric: IAssetsHistoric[];
  total: number;
  isLoading: boolean;
  historicAssetsList: IAssetsHistoric[];
  openModalInfo: (data: IAssets | ICollaborators, type: string) => void;
  openModal: (type: string, data?: IAssetsHistoric | undefined) => void
}

type Color = "success" | "secondary" | "danger" | "warning";

export function TableManagement({
  lastAssetsHistoric,
  isLoading,
  historicAssetsList,
  total,
  openModalInfo,
  openModal,
}: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const statusColorMap = {
    Disponível: "success",
    Alocado: "secondary",
    Desabilitado: "danger",
    Manutenção: "warning",
  };

  const hasSearchFilter = Boolean(filterValue) || Boolean(statusFilter);

  const columns = [
    {
      key: "idClient",
      label: "Id Ativo",
    },
    {
      key: "description",
      label: "Ativo",
    },
    {
      key: "dateRegister",
      label: "Data ocorrência",
    },
    {
      key: "name",
      label: "Colaborador",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "user",
      label: "Registrado por",
    },

    { key: "actions", label: "" },
  ];
  const statusOptions = ["Disponível", "Alocado", "Desabilitado", "Manutenção"];

  const filteredItems = hasSearchFilter
    ? historicAssetsList.filter((asset) => {
        if (statusFilter != "" && filterValue === "") {
          if (asset.status === statusFilter) {
            return asset;
          }
        } else if (statusFilter != "" && filterValue !== "") {
          let filter1;
          if (asset.status === statusFilter) {
            filter1 = asset;
          }

          if (filter1) {
            return (
              filter1.collaborator?.name
                .toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              filter1.asset?.description
                .toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              filter1.asset?.idClient.includes(filterValue)
            );
          }
        } else {
          return (
            asset.collaborator?.name
              .toLowerCase()
              .includes(filterValue.toLowerCase()) ||
            asset.asset?.description
              .toLowerCase()
              .includes(filterValue.toLowerCase()) ||
            asset.asset?.idClient.includes(filterValue)
          );
        }
      })
    : lastAssetsHistoric;

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = React.useCallback(
    (asset: IAssetsHistoric, columnKey: React.Key) => {
      const cellValue = (asset as any)[columnKey.toString()];

      switch (columnKey) {
        case "dateRegister" || "createdAt":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {new Date(cellValue).toLocaleDateString()}
              </p>
            </div>
          );

        case "idClient":
          return (
            <div className="flex flex-col">
              <p
                className="text-bold text-sm capitalize hover:text-orange-600 hover:cursor-pointer"
                onClick={() => openModalInfo(asset.asset as IAssets, "asset")}
              >
                {asset.asset?.idClient}
              </p>
            </div>
          );

        case "description":
          return (
            <div className="flex flex-col">
              <p
                className="text-bold text-sm capitalize hover:text-orange-600 hover:cursor-pointer"
                onClick={() => openModalInfo(asset.asset as IAssets, "asset")}
              >
                {asset.asset?.description}
              </p>
            </div>
          );

        case "name":
          return (
            <div className="flex flex-col">
              <p
                className="text-bold text-sm capitalize hover:text-orange-600 hover:cursor-pointer"
                onClick={() =>
                  asset.collaborator &&
                  openModalInfo(asset.collaborator, "collaborator")
                }
              >
                {asset.collaborator ? asset.collaborator?.name : "-"}
              </p>
            </div>
          );

        case "user":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">
                {asset.user?.name}
              </p>
            </div>
          );

        case "status":
          const assetStatus =
            asset.status === "Alocado"
              ? StatusAssets.Alocated
              : asset.status === "Disponível"
              ? StatusAssets.Available
              : asset.status === "Desabilitado"
              ? StatusAssets.Disabled
              : StatusAssets.Maintenance;

          return (
            <Chip
              className="capitalize items-center"
              color={statusColorMap[assetStatus] as Color}
              size="sm"
              variant="flat"
            >
              {asset.status}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Popover placement="left">
                <PopoverTrigger>
                  <span
                    className={
                      asset.observation
                        ? "text-lg cursor-pointer"
                        : "opacity-30"
                    }
                  >
                    <Eye size={18} color="#717171" />
                  </span>
                </PopoverTrigger>

                <PopoverContent>
                  <div className="px-1 py-2">
                    <div className="text-small font-bold">Observações</div>
                    <div className="text-tiny">{asset.observation}</div>
                  </div>
                </PopoverContent>
              </Popover>
              <Tooltip className="bg-slate-100 " content="Editar" size="sm">
                <span
                  className="text-lg cursor-pointer "
                  onClick={() => {
                    openModal("edit", asset);
                  }}
                >
                  <PencilLine size={18} color="#717171" />
                </span>
              </Tooltip>
            </div>
          );
        default:
          return cellValue;
      }
    },
    [lastAssetsHistoric, onSearchChange]
  );

  const capitalize = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            classNames={{
              base: "w-full sm:max-w-[44%]",
              inputWrapper: "border-1",
            }}
            placeholder="Buscar..."
            size="sm"
            startContent={<Search size={20} />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 items-center">
            <div className="relative">
              {statusFilter != "" && (
                <S.IconClose
                  src={iconClose}
                  onClick={() => setStatusFilter("")}
                />
              )}

              <Dropdown className="min-w-fit">
                <DropdownTrigger
                  className={
                    statusFilter ? "hidden sm:flex ps-8 " : "hidden sm:flex "
                  }
                >
                  <Button
                    endContent={<ChevronDown size={20} />}
                    size="sm"
                    variant="flat"
                  >
                    {statusFilter
                      ? `Status: ${statusFilter}`
                      : "Filtrar por Status"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Table Columns"
                  closeOnSelect={true}
                  selectedKeys={statusFilter}
                  selectionMode="single"
                  hideSelectedIcon
                  variant="flat"
                >
                  {statusOptions.map((status) => (
                    <DropdownItem
                      key={status}
                      className="capitalize"
                      startContent={
                        <Circle
                          size={6}
                          color={
                            status === "Disponível"
                              ? "#17C964"
                              : status === "Alocado"
                              ? "#9353D3"
                              : status === "Manutenção"
                              ? "#F5A524"
                              : status === "Desabilitado"
                              ? "#C20E4D"
                              : ""
                          }
                          fill={
                            status === "Disponível"
                              ? "#17C964"
                              : status === "Alocado"
                              ? "#9353D3"
                              : status === "Manutenção"
                              ? "#F5A524"
                              : status === "Desabilitado"
                              ? "#C20E4D"
                              : ""
                          }
                          strokeWidth={1.25}
                        />
                      }
                      onClick={() => setStatusFilter(status)}
                    >
                      {capitalize(status)}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            </div>

            <Button
              className="bg-foreground text-background"
              endContent={<Plus />}
              size="sm"
              onClick={() => openModal("new")}
            >
              Nova ocorrência
            </Button>
          </div>
        </div>
        {hasSearchFilter ? (
          <span className="text-default-400 text-small">
            Encontrados {filteredItems.length} registros
          </span>
        ) : (
          <span className="text-default-400 text-small">
            Exibindo últimos {filteredItems.length} registros
          </span>
        )}
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    lastAssetsHistoric.length,
    total,
    hasSearchFilter,
  ]);

  return (
    <S.Table>
      <Table topContent={topContent} topContentPlacement="outside">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={"center"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredItems}
          emptyContent={"Nenhum registro encontrado"}
          loadingContent={<Spinner color="default" />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </S.Table>
  );
}
