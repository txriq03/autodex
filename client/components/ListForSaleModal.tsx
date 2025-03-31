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
import { useFormContext, Controller, useForm } from "react-hook-form";
import { Input } from "@heroui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
const priceSchema = z.object({
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .positive({ message: "Price must be greater than 0." }),
});
type TPriceSchema = z.infer<typeof priceSchema>;

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
              List For Sale
            </ModalHeader>
            <ModalBody>
              <ListForSaleForm />
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
              >
                Action
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

const ListForSaleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TPriceSchema>({
    resolver: zodResolver(priceSchema),
  });

  const onSubmit = async (data: TPriceSchema) => {
    // "use server";

    addToast({
      title: "Price updated to: " + data.price,
      color: "success",
      variant: "flat",
    });

    // Validate form data
    // const result = priceSchema.safeParse(data);
    // if (!result.success) {
    //   // Get flattened errors to display in the form
    //   const errors = result.error.flatten();
    //   return { validationErrors: errors.fieldErrors };
    // }
    reset();
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)} id="listForSaleForm">
      <Input
        {...register("price")}
        type="string"
        placeholder="0.0"
        label="Price (ETH)"
        labelPlacement="outside"
        isInvalid={!!errors.price}
        errorMessage={errors.price?.message}
      />
    </Form>
  );
};
export default ListForSaleModal;
