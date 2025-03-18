import React, { useContext, useState } from "react";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ContractContext } from "./providers/ContractProvider";
import { addServiceProviderSchema } from "@/lib/validation";
import { LoaderCircle, UserRoundPlus } from "lucide-react";

const AddServiceProviderDialog = () => {
  const { contract, account } = useContext(ContractContext);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    resolver: zodResolver(addServiceProviderSchema),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = async ({ address }: { address: string }) => {
    if (!contract || !account) return;

    try {
      setIsSubmitting(true);
      const tx = await contract.addServiceProvider(address);
      await tx.wait();
      toast.success("Service provider added");
      form.reset();
    } catch (error: any) {
      toast.error("Error", { description: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="bg-transparent border-slate-500"> <UserRoundPlus /> Add Service Provider</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Service Provider</DialogTitle>
          <DialogDescription>
            Authorize a wallet address to add service logs.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Wallet Address</FormLabel>
                  <FormControl>
                    <Input placeholder="0x..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">
                  Cancel
                </Button>
              </DialogClose>
              {isSubmitting ? (
                <Button type="submit" disabled> <LoaderCircle className="animate-spin"/> Authorising...</Button>
              ) : (
                <Button type="submit">Authorise</Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddServiceProviderDialog;
