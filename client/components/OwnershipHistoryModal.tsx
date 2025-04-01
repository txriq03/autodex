import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import React from "react";

const OwnershipHistoryModal = ({
  isOpen,
  onOpenChange,
  tokenId,
}: {
  isOpen: any;
  onOpenChange: any;
  tokenId: number;
}) => {
  return (
    <Modal backdrop="opaque" isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[1.5rem] font-light">
              Ownership History
            </ModalHeader>
            <ModalBody>
              <div>Hello</div>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                radius="sm"
                onPress={onClose}
              >
                Close
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default OwnershipHistoryModal;
