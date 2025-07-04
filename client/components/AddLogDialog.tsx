import React, { useContext, useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "@heroui/button";
import { Pen } from "lucide-react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { logSchema, LogFormData } from "@/lib/validation";
import { Input } from "./ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ContractContext } from "./providers/ContractProvider";
import { useParams } from "next/navigation";
import { toast } from "sonner";
import { addToast } from "@heroui/toast";

const AddLogDialog = () => {
  const form = useForm<LogFormData>({
    resolver: zodResolver(logSchema),
    defaultValues: {
      garage: "",
      mileage: 0,
      description: "",
    },
  });

  const queryClient = useQueryClient();
  const { contract, account } = useContext(ContractContext);
  const { vin } = useParams();
  const [tokenId, setTokenId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTokenId = async () => {
      if (contract && vin) {
        try {
          const id = await contract.getTokenIdByVIN(vin);
          setTokenId(Number(id));
        } catch (error) {
          addToast({
            title: "Could not find token ID from VIN",
            description: error instanceof Error ? error.message : String(error),
            color: "danger",
            variant: "flat",
          });
        }
      }
    };
    fetchTokenId();
  }, [contract, vin]);

  const mutation = useMutation({
    mutationFn: async (data: LogFormData) => {
      if (!contract || !account || tokenId === null) {
        addToast({
          title: "Critical values not available",
          description: "Missing contract, account, or tokenId",
          color: "danger",
          variant: "flat",
        });
        throw new Error("Missing contract, account or tokenId");
      }
      const isAuthorised = await contract.getIsServiceProvider(account);
      if (!isAuthorised) {
        throw new Error("Not authorised to add service record.");
      }

      const tx = await contract.addServiceRecord(
        tokenId,
        data.description,
        data.garage,
        data.mileage
      );

      const receipt = await tx.wait();
      console.log(
        "Gas used from addServiceRecord():",
        receipt.gasUsed.toString()
      );
    },
    onSuccess: () => {
      addToast({
        title: "Service log added",
        color: "success",
        variant: "flat",
      });
      if (tokenId !== null) {
        queryClient.invalidateQueries({ queryKey: ["serviceLogs", tokenId] });
      }
      form.reset();
      setOpen(false);
    },
    onError: (error: any) => {
      console.error(error.message);
      addToast({
        title: "Failed to add log",
        description: error.message || "Check wallet access or contract state.",
        color: "danger",
        variant: "flat",
      });
    },
  });

  const onSubmit = (data: LogFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="solid"
          color="primary"
          radius="sm"
          startContent={<Pen />}
        >
          Add log
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service Log</DialogTitle>
          <DialogDescription>Enter service details below.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="garage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Garage Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. KwikFit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mileage</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g. 15000" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. Oil change & filter replacement"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="max-sm:gap-2">
              <DialogClose asChild>
                <Button color="danger" variant="flat">
                  Cancel
                </Button>
              </DialogClose>

              <Button
                type="submit"
                color="primary"
                variant="solid"
                isLoading={mutation.isPending}
              >
                {mutation.isPending ? "Submitting" : "Submit"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddLogDialog;
