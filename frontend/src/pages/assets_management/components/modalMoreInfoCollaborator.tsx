import { CustomModal } from "../../../components/customModal";
import * as S from "../styles";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";

interface Props {
  data: ICollaborators;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ModalMoreInfoCollaborator({
  isOpen,
  onOpenChange,
  data,
}: Props) {
  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle={"Colaborador"}
      size="sm"
    >
      <S.ContainerData>
        <S.ContentData>
          <S.ItemTitle>Nome:</S.ItemTitle>
          <span>{(data as ICollaborators)?.name}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>Email:</S.ItemTitle>
          <span>{(data as ICollaborators)?.email}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>Telefone:</S.ItemTitle>
          <span>{(data as ICollaborators)?.phone}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>Status:</S.ItemTitle>
          {(data as ICollaborators)?.status}
        </S.ContentData>
      </S.ContainerData>
    </CustomModal>
  );
}
