import React, { useState } from "react";
import { IAssets } from "../../../interfaces/IAssets.interface";
import * as S from "../styles";

import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Pagination,
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
import {
  ChevronDown,
  Circle,
  Eye,
  PencilLine,
  Plus,
  Search,
} from "lucide-react";
import iconPdf from "../../../assets/icons/pdf.png";
import iconClose from "../../../assets/icons/fechar.png";
import { StatusAssets } from "../../../enums/statusAssets.enum";
import { uploads } from "../../../utils/config";

interface Props {
  assetsList: IAssets[];
  total: number;
  isLoading: boolean;
  setAssetEdit: (data: IAssets) => void;
  openModal: (type: string, asset?: IAssets) => void;
  handleListAssets: (page: number) => void;
  listComplete: IAssets[];
}

type Color = "success" | "secondary" | "danger" | "warning";

export function TableComponent({
  assetsList,
  isLoading,
  openModal,
  handleListAssets,
  listComplete,
  total,
}: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

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
      label: "Id",
    },
    {
      key: "description",
      label: "Descrição",
    },
    {
      key: "purchaseDate",
      label: "Data da compra",
    },
    {
      key: "closingGuarantee",
      label: "Encerramento garantia",
    },
    {
      key: "supplier",
      label: "Fornecedor",
    },
    {
      key: "invoice",
      label: "Nota fiscal",
    },
    {
      key: "status",
      label: "Status",
    },
    {
      key: "canAllocated",
      label: "Pode ser alocado?",
    },

    { key: "actions", label: "" },
  ];
  const statusOptions = ["Disponível", "Alocado", "Desabilitado", "Manutenção"];
 
  const filteredItems = hasSearchFilter
    ? listComplete.filter((asset) => {
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
              filter1.description
                .toLowerCase()
                .includes(filterValue.toLowerCase()) ||
              filter1.idClient.includes(filterValue)
            );
          }
        } else {
          return (
            asset.description
              .toLowerCase()
              .includes(filterValue.toLowerCase()) ||
            asset.idClient.includes(filterValue)
          );
        }
      })
    : assetsList;

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue("");
    }
  }, []);

  function verifyClosingGuarantee(date: Date) {
    const today = new Date().getTime();
    const dateInTimestamp = date.getTime();

    if (dateInTimestamp > today) {
      return true;
    } else {
      return false;
    }
  }

  const renderCell = React.useCallback(
    (asset: IAssets, columnKey: React.Key) => {
      const cellValue = (asset as any)[columnKey.toString()];
      const invoiceUrl = asset.invoice?.startsWith("http") ? asset.invoice : `${uploads}/${asset.invoice}`;

      switch (columnKey) {
        case "uid" || "description" || "supplier":
          return (
            <div className="flex flex-col items-center">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );

        case "purchaseDate":
          return (
            <div className="flex flex-col items-center">
              <p className="text-bold text-sm capitalize">
                {new Date(cellValue).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
              </p>
            </div>
          );

        case "closingGuarantee":
          return (
            <div className="flex flex-col items-center">
              <p
                className={
                  verifyClosingGuarantee(new Date(cellValue))
                    ? "text-bold text-sm capitalize"
                    : " text-red-600 text-bold text-sm capitalize"
                }
              >
                {new Date(cellValue).toLocaleDateString("pt-BR", {
                  timeZone: "UTC",
                })}
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
        case "invoice":
          return (
            <div className="flex flex-col items-center">
              {asset.invoice ? (
                <a
                  href={invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={iconPdf} className="w-7 cursor-pointer" />
                </a>
              ) : (
                "-"
              )}
            </div>
          );
        case "canAllocated":
          return (
            <div className="flex flex-col items-center">
              {asset.canAllocated === true ? (
                <p className="text-bold text-sm capitalize">Sim</p>
              ) : (
                <p className="text-bold text-sm capitalize">Não</p>
              )}
            </div>
          );
        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Popover placement="left">
                <PopoverTrigger>
                  <span
                    className={
                      asset.observation && asset.observation !== "undefined"
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
                    <div className="text-tiny">{asset.observation && asset.observation !== "undefined" ? asset.observation : "-"}</div>
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
    []
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
            placeholder="Buscar pela descrição ou id..."
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
              color="primary"
              size="sm"
              onClick={() => openModal("new")}
            >
              Novo ativo
            </Button>
          </div>
        </div>
        <span className="text-default-400 text-small">
          Total {total} ativos
        </span>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    onSearchChange,
    assetsList.length,
    total,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center w-full">
        {assetsList.length > 0 ? (
          <Pagination
            showControls
            classNames={{
              cursor: "bg-foreground text-background",
            }}
            isDisabled={hasSearchFilter}
            page={page}
            total={Math.ceil(total / 8)}
            variant="light"
            onChange={(page) => {
              setPage(page), handleListAssets(page);
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }, [assetsList.length, page, hasSearchFilter, total]);

  return (
    <S.Table>
      <Table
        bottomContent={bottomContent}
        topContent={topContent}
        topContentPlacement="outside"
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn key={column.key} align={"center"}>
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody
          items={filteredItems}
          emptyContent={"Nenhum ativo cadastrado"}
          loadingContent={<Spinner color="default" />}
          loadingState={isLoading ? "loading" : "idle"}
        >
          {(item) => (
            <TableRow key={item.idClient}>
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
