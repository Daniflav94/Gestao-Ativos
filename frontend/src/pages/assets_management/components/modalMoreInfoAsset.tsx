import { CustomModal } from "../../../components/customModal";
import { IAssets } from "../../../interfaces/IAssets.interface";
import iconPdf from "../../../assets/icons/pdf.png";
import * as S from "../styles";
import { ICollaborators } from "../../../interfaces/ICollaborators.interface";

interface Props {
  data: IAssets | ICollaborators;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function ModalMoreInfoAsset({ isOpen, onOpenChange, data }: Props) {
  return (
    <CustomModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      modalTitle={"Ativo"}
      size="sm"
    >
      <S.ContainerData>
        <S.ContentData>
          <S.ItemTitle>
            Id:
          </S.ItemTitle>
          <span>{(data as IAssets)?.idClient}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>
            Descrição:
          </S.ItemTitle>
          <span>{(data as IAssets)?.description}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>
            Data da compra:
          </S.ItemTitle>
          <span>{new Date((data as IAssets)?.purchaseDate).toLocaleDateString()}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>
            Encerramento garantia:
          </S.ItemTitle>
          <span>{new Date((data as IAssets)?.closingGuarantee).toLocaleDateString()}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>
            Fornecedor:
          </S.ItemTitle>
          <span>{(data as IAssets)?.supplier}</span>
        </S.ContentData>

        <S.ContentData>
          <S.ItemTitle>
            Nota fiscal:
          </S.ItemTitle>
          <span>
            {(data as IAssets)?.invoice ? (
              <a
                href={(data as IAssets).invoice}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={iconPdf} className="w-7 cursor-pointer" />
              </a>
            ) : (
              "-"
            )}
          </span>
        </S.ContentData>
      </S.ContainerData>
    </CustomModal>
  );
}
