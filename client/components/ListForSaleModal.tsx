"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";

const ListForSaleModal = ({ isOpen, onOpenChange }: any) => {
  return (
    <Modal
      backdrop="opaque"
      className="dark text-slate-50 "
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[1.5rem] font-light">
              Modal Title
            </ModalHeader>
            <ModalBody></ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                radius="sm"
                onPress={onClose}
              >
                Close
              </Button>
              <Button color="primary" radius="sm" onPress={onClose}>
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ListForSaleModal;
