import { SubmitHandler } from "react-hook-form";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { toast } from "sonner";
import {
  createCollaborator,
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
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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

  const onSubmitCollaborator: SubmitHandler<ICollaborators> = async (data) => {
    const newCollaborator: ICollaborators = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      status: "Ativo",
    };

    const res = await createCollaborator(newCollaborator);

    if (!res.error) {
      toast.success("Colaborador cadastrado com sucesso!");

      handleListCollaborators(1);
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
        <S.Title>COLABORADORES</S.Title>
        <S.Subtitle>
          Listagem de todos os colaboradores cadastrados.{" "}
        </S.Subtitle>
      </S.Header>

      <TableCollaborators
        total={total}
        listCollaborators={collaborators}
        isLoading={isLoading}
        setIsModalNewCollaboratorOpen={setIsModalNewCollaboratorOpen}
        handleListCollaborators={handleListCollaborators}
        listComplete={allCollaborators}
      />

      <ModalCollaborator
        isOpen={isModalNewCollaboratorOpen}
        onOpenChange={setIsModalNewCollaboratorOpen}
        onSubmit={onSubmitCollaborator}
      />
    </S.Container>
  );
}
