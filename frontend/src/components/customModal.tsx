import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@nextui-org/react";

interface Props {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  modalTitle: string;
  children: string | JSX.Element | JSX.Element[];
  size?: "lg" | "xs" | "sm" | "md" | "xl" | "2xl" | "3xl" | "4xl" | "5xl" | "full";
}

export function CustomModal({
  isOpen,
  onOpenChange,
  modalTitle,
  children,
  size = "lg",
}: Props) {
  return (
    <>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        className="max-h-[85%] overflow-auto outline-none"
        size={size}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {modalTitle}
              </ModalHeader>
              <ModalBody className="flex flex-col items-center">
                {children}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
