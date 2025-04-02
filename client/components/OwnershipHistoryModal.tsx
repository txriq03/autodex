import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import React from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
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
    <Modal
      backdrop="opaque"
      size={"xl"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[1.5rem] font-light">
              Ownership History
            </ModalHeader>
            <ModalBody>
              <Table>
                <TableHeader>
                  <TableColumn>ADDRESS</TableColumn>
                  <TableColumn>TIMESTAMP</TableColumn>
                </TableHeader>
                <TableBody>
                  <TableRow key="1">
                    <TableCell>
                      0xfee64cf73de9db23d259735cb3441d943073e245
                    </TableCell>
                    <TableCell>24/10/25</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
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
