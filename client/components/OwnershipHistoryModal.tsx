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
import { Alert } from "@heroui/alert";

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
    enabled: isOpen,
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
              {history && history.length > 0 ? (
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
              ) : (
                <Alert
                  title="No information"
                  description="You may have to connect your wallet to view ownership history."
                  variant="faded"
                  color="warning"
                />
              )}
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
