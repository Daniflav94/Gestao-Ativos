import { SubmitHandler } from "react-hook-form";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { toast } from "sonner";
import {
  createCollaborator,
  editCollaborator,
  listAllCollaborator,
  listCollaboratorsWithPagination,
} from "../../services/collaborators.service";
import { useEffect, useState } from "react";
import * as S from "./styles";
import { ModalCollaborator } from "./components/modalCollaborator";
import { TableCollaborators } from "./components/tableCollaborators";

export function Collaborators() {
  const [isModalNewCollaboratorOpen, setIsModalNewCollaboratorOpen] =
    useState(false);
  const [collaborators, setCollaborators] = useState<ICollaborators[]>([]);
  const [allCollaborators, setAllCollaborators] = useState<ICollaborators[]>(
    []
  );
  const [collaboratorEditing, setCollaboratorEditing] =
    useState<ICollaborators>();
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [statusSelected, setStatusSelected] = useState(new Set([]));

  useEffect(() => {
    handleListCollaborators(1);
  }, []);

  const handleListCollaborators = async (page: number) => {
    setIsLoading(true);
    const res = await listCollaboratorsWithPagination(page);
    const resAllCollaborators = await listAllCollaborator();

    if (res.data) {
      setCollaborators(res.data);
      setTotal(res.total);
    }

    if (resAllCollaborators.data) {
      setAllCollaborators(resAllCollaborators.data);
    }
    setIsLoading(false);
  };

  const updateCollaborator: SubmitHandler<ICollaborators> = async (data) => {
    let statusString = collaboratorEditing?.status;

    statusSelected.forEach((value: string) => {
      value === "Ativo"
        ? (statusString = "Ativo")
        : (statusString = "Desativado");
    });

    const edit: ICollaborators = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: statusString as string,
    };

    const res = await editCollaborator(collaboratorEditing?.id as string, edit);

    if (!res.errors) {
      toast.success("Colaborador editado!");

      handleListCollaborators(1);
      setIsModalNewCollaboratorOpen(false);
    } else {
      res.errors[0].msg
        ? toast.error(res.errors[0].msg)
        : toast.error(res.errors[0]);
    }
  };

  const onSubmitCollaborator: SubmitHandler<ICollaborators> = async (data) => {
    if (!collaboratorEditing) {
      const newCollaborator: ICollaborators = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        status: "Ativo",
      };

      const res = await createCollaborator(newCollaborator);

      if (!res.errors) {
        toast.success("Colaborador cadastrado com sucesso!");

        handleListCollaborators(1);
        setIsModalNewCollaboratorOpen(false);
      } else {
        res.errors[0].msg
          ? toast.error(res.errors[0].msg)
          : toast.error(res.errors[0]);
      }
    } else {
      updateCollaborator(data);
    }
  };

  const openModal = (type: string, collaborator?: ICollaborators) => {
    if (type === "new") {
      setCollaboratorEditing(undefined);
      setIsModalNewCollaboratorOpen(true);
    } else {
      setCollaboratorEditing(collaborator);
      setIsModalNewCollaboratorOpen(true);
    }
  };

  return (
    <S.Container>
      <S.Header>
        <S.Title>COLABORADORES</S.Title>
        <S.Subtitle>Listagem de todos os colaboradores cadastrados </S.Subtitle>
      </S.Header>

      <TableCollaborators
        total={total}
        listCollaborators={collaborators}
        isLoading={isLoading}
        openModal={openModal}
        handleListCollaborators={handleListCollaborators}
        listComplete={allCollaborators}
      />

      <ModalCollaborator
        isOpen={isModalNewCollaboratorOpen}
        onOpenChange={setIsModalNewCollaboratorOpen}
        onSubmit={onSubmitCollaborator}
        collaborator={collaboratorEditing}
        setStatusSelected={setStatusSelected}
      />
    </S.Container>
  );
}
