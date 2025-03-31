"use client";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { useContext } from "react";
import { ContractContext } from "./providers/ContractProvider";
import { parseEther } from "ethers";

const priceSchema = z.object({
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be greater than 0." }),
});
type TPriceSchema = z.infer<typeof priceSchema>;

const ListForSaleModal = ({ isOpen, onOpenChange, tokenId }: any) => {
  const { contract, account, signer } = useContext(ContractContext);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TPriceSchema>({
    resolver: zodResolver(priceSchema),
  });

  const onSubmit = async (data: TPriceSchema) => {
    const priceInWei = parseEther(data.price.toString());
    try {
      const tx = await contract.listCarForSale(tokenId, priceInWei);
      addToast({
        title: "Success!",
        description: "Your vehicle is now for sale for " + data.price + " ETH",
        color: "success",
        variant: "flat",
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error changing price:", error.message);
        addToast({
          title: "Error listing vehicle for sale.",
          description: error.message,
          color: "danger",
          variant: "flat",
        });
      } else {
        console.error("Unknown error changing price.");
        addToast({
          title: "Unknown error occurred",
          description: "Error listing vehicle for sale",
          color: "danger",
          variant: "flat",
        });
      }
    }

    reset();
  };

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
              List For Sale
            </ModalHeader>
            <ModalBody>
              {/* Form */}
              <Form onSubmit={handleSubmit(onSubmit)} id="listForSaleForm">
                <Input
                  {...register("price")}
                  type="text"
                  placeholder="0.0"
                  label="Price (ETH)"
                  labelPlacement="outside"
                  isInvalid={!!errors.price}
                  errorMessage={errors.price?.message}
                />
              </Form>{" "}
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
              <Button
                color="primary"
                radius="sm"
                type="submit"
                form="listForSaleForm"
                isLoading={isSubmitting}
              >
                {isSubmitting ? "Submitting.." : "Submit"}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ListForSaleModal;
