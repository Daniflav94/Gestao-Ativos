import React, { useState } from "react";
import * as S from "../styles";

import {
  Button,
  Chip,
  Input,
  Pagination,
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
import { PencilLine, Search, UserRoundPlus } from "lucide-react";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";

interface Props {
  listCollaborators: ICollaborators[];
  listComplete: ICollaborators[];
  total: number;
  isLoading: boolean;
  setIsModalNewCollaboratorOpen: (isOpen: boolean) => void;
  handleListCollaborators: (page: number) => void;
}

type Color = "success" | "secondary" | "danger" | "warning";

export function TableCollaborators({
  isLoading,
  setIsModalNewCollaboratorOpen,
  listCollaborators,
  listComplete,
  handleListCollaborators,
  total,
}: Props) {
  const [filterValue, setFilterValue] = useState("");
  const [page, setPage] = useState(1);

  const statusColorMap = {
    Ativo: "success",
    Desativado: "warning",
  };

  const hasSearchFilter = Boolean(filterValue);

  const columns = [
    {
      key: "name",
      label: "Nome",
    },
    {
      key: "email",
      label: "E-mail",
    },
    {
      key: "phone",
      label: "Telefone",
    },
    {
      key: "status",
      label: "Status",
    },

    { key: "actions", label: "" },
  ];

  const filteredItems = hasSearchFilter
    ? listComplete.filter((collaborator) => {
        return (
          collaborator?.name
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          collaborator?.email
            .toLowerCase()
            .includes(filterValue.toLowerCase()) ||
          collaborator?.phone.includes(filterValue)
        );
      })
    : listCollaborators;

  const onSearchChange = React.useCallback((value: string) => {
    if (value) {
      setFilterValue(value);
    } else {
      setFilterValue("");
    }
  }, []);

  const renderCell = React.useCallback(
    (collaborator: ICollaborators, columnKey: React.Key) => {
      const cellValue = (collaborator as any)[columnKey.toString()];

      switch (columnKey) {
        case "name" || "email" || "phone":
          return (
            <div className="flex flex-col">
              <p className="text-bold text-sm capitalize">{cellValue}</p>
            </div>
          );

        case "status":
          const status =
            collaborator.status === "Ativo" ? "Ativo" : "Desativado";

          return (
            <Chip
              className="capitalize items-center"
              color={statusColorMap[status] as Color}
              size="sm"
              variant="flat"
            >
              {collaborator.status}
            </Chip>
          );

        case "actions":
          return (
            <div className="relative flex items-center gap-2">
              <Tooltip className="bg-slate-100 " content="Editar" size="sm">
                <span
                  className="text-lg cursor-pointer "
                  onClick={() => {
                    // setAssetEdit(asset), setIsModalNewCollaboratorOpen(true);
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
    [listCollaborators, onSearchChange]
  );

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
            placeholder="Buscar por nome, email ou telefone"
            size="sm"
            startContent={<Search size={20} />}
            value={filterValue}
            variant="bordered"
            onClear={() => setFilterValue("")}
            onValueChange={onSearchChange}
          />
          <div className="flex gap-3 items-center">
            <Button
              className="bg-foreground text-background"
              endContent={<UserRoundPlus size={16} />}
              size="sm"
              onClick={() => setIsModalNewCollaboratorOpen(true)}
            >
              Novo Colaborador
            </Button>
          </div>
        </div>
        {hasSearchFilter ? (
          <span className="text-default-400 text-small">
            Encontrados {filteredItems.length} colaboradores
          </span>
        ) : (
          <span className="text-default-400 text-small">
            Total de {total} colaboradores
          </span>
        )}
      </div>
    );
  }, [
    filterValue,
    onSearchChange,
    listCollaborators.length,
    total,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-center items-center w-full">
        {listCollaborators.length > 0 ? (
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
              setPage(page), handleListCollaborators(page);
            }}
          />
        ) : (
          ""
        )}
      </div>
    );
  }, [listCollaborators.length, page, hasSearchFilter, total]);

  return (
    <S.Table>
      <Table
        topContent={topContent}
        bottomContent={bottomContent}
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
          emptyContent={"Nenhum colaborador encontrado"}
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
