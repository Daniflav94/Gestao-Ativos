import { SubmitHandler } from "react-hook-form";
import { ICollaborators } from "../../interfaces/ICollaborators.interface";
import { toast } from "sonner";
import { createCollaborator } from "../../services/collaborators.service";
import { useState } from "react";

export function Collaborators() {
  const [isModalNewCollaboratorOpen, setIsModalNewCollaboratorOpen] =
    useState(false);

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

      setIsModalNewCollaboratorOpen(false);
    } else {
      toast.error(
        "Ocorreu um erro ao cadastrar colaborador. Tente novamente mais tarde."
      );
    }
  };
  return <></>;
}
