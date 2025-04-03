"use client";
import { Button } from "@heroui/button";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import React, { useContext } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
} from "@heroui/table";
import { useQuery } from "@tanstack/react-query";
import { getOwnershipHistory } from "@/lib/web3/contractServices";
import { ContractContext } from "./providers/ContractProvider";

const OwnershipHistoryModal = ({
  isOpen,
  onOpenChange,
  tokenId,
}: {
  isOpen: any;
  onOpenChange: any;
  tokenId: number;
}) => {
  const { contract } = useContext(ContractContext);
  const {
    data: history,
    error,
    isPending,
  } = useQuery({
    queryKey: ["history", tokenId],
    queryFn: () => getOwnershipHistory(contract, tokenId),
  });

  return (
    <Modal
      backdrop="opaque"
      size={"2xl"}
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      aria-label="Ownership History"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="text-[1.5rem] font-light">
              Ownership History
            </ModalHeader>
            <ModalBody>
              <Table aria-label="Ownership History">
                <TableHeader>
                  <TableColumn>ADDRESS</TableColumn>
                  <TableColumn>TIMESTAMP</TableColumn>
                </TableHeader>
                <TableBody>
                  {history.map((record: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>{record.owner}</TableCell>
                      <TableCell>{record.timestamp}</TableCell>
                    </TableRow>
                  ))}
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
