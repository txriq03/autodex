"use client";
import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Control, FieldPath, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { ContractContext } from "./providers/ContractProvider";
import { uploadToIPFS, uploadImageToIPFS } from "@/lib/web3/ipfs";
import { CarFormData, carSchema } from "@/lib/validation";
import { Check, ChevronsUpDown, LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { parseEther } from "ethers";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import carList from "@/data/car-list.json";
import { ScrollArea } from "./ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const VehicleForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { contract, provider } = useContext(ContractContext);
  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: "",
      model: "",
      vin: "",
      registrationNumber: "",
      transmission: undefined,
      fuelType: undefined,
      image: undefined,
      year: new Date().getFullYear(),
      mileage: 0,
      price: 0,
    },
  });

  const selectedMake = form.watch("make");

  const makes = useMemo(() => carList.map((c) => c.brand), []);
  const models = useMemo(() => {
    const found = carList.find((entry) => entry.brand === selectedMake);
    return found?.models || [];
  }, [selectedMake]);

  useEffect(() => {
    form.setValue("model", "");
  }, [selectedMake]);

  const onSubmit = async (data: CarFormData) => {
    let imageUrl: string | void = "";
    let tokenURI: string | void = "";

    if (!contract || !provider) {
      console.error("Error: User not logged into wallet.");
      toast.warning("Please  unlock your wallet");
      return null;
    }
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    setIsLoading(true);
    try {
      try {
        imageUrl = await uploadImageToIPFS(data.image[0]);
      } catch (imageError) {
        console.error("Error uploading image to IPFS:", imageError);
        alert("Error uploading image to IPFS.");
      }

      try {
        console.log("ImageURL before IPFS upload:", imageUrl);
        tokenURI = await uploadToIPFS(data, imageUrl, userAddress);
      } catch (err) {
        console.error("Error uploading metadata to IPFS:", err);
      }

      try {
        const tx = await contract.mintCar(
          userAddress,
          data.vin,
          parseEther(data.price.toString()),
          tokenURI
        );

        await tx.wait();
        console.log("Car minted successfully!");
        form.reset();
        router.push("/?success=true");
      } catch (mintError) {
        console.error("Error minting vehicle:", mintError);

        // Toast
        toast.error("Minting failed.", {
          classNames: {
            toast: "bg-rose-500",
            description: "text-slate-500",
          },
          description: "Please check your wallet and try again",
        });
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      alert("Something went wrong.");
    }
    setIsLoading(false);
  };

  return (
    <Card className=" max-w-[700px] mx-auto dark:text-slate-50 dark:bg-slate-50/5 bg-slate-50 bg-opacity-[3%]  text-slate-50">
      <CardHeader>
        <CardTitle>Vehicle information</CardTitle>
        <CardDescription>
          We need information to put up your vehicle in the marketplace.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid w-full items-center gap-4">
            <ComboBoxField
              formControl={form.control}
              name="make"
              label="Make"
              type="make"
              options={makes}
            />
            <ComboBoxField
              formControl={form.control}
              name="model"
              label="Model"
              type="model"
              options={models}
              disabled={!selectedMake}
            />
            <VehicleFormField
              name="year"
              label="Year"
              placeholder="1998"
              description="Cannot be earlier than 1886."
              inputType="number"
              formControl={form.control}
            />
            <VehicleFormField
              name="vin"
              label="Vehicle Identification Number"
              placeholder="1 123 456 789 0 ABC"
              description="Can be found on your chassis or V5C."
              inputType="text"
              formControl={form.control}
            />
            <VehicleFormField
              name="registrationNumber"
              label="Registration Number"
              placeholder="ABC123"
              inputType="text"
              formControl={form.control}
            />
            <VehicleSelectField
              name="transmission"
              label="Transmission"
              formControl={form.control}
              placeholder="Select transmission"
            />
            <VehicleSelectField
              name="fuelType"
              label="Fuel type"
              formControl={form.control}
              placeholder="Select fuel type"
            />
            <VehicleFormField
              name="mileage"
              label="Mileage"
              placeholder="20,000"
              inputType="number"
              formControl={form.control}
            />
            <VehicleFormField
              name="price"
              label="Price (in ETH)"
              placeholder="0.00"
              description="Leave blank if you do not wish to sell your vehicle."
              inputType="number"
              formControl={form.control}
            />
            <VehicleFormField
              name="image"
              label="Image"
              placeholder=""
              inputType="file"
              formControl={form.control}
            />
          </CardContent>
          <CardFooter>
            {isLoading ? (
              <Button disabled className="bg-slate-50 text-slate-800">
                <LoaderCircle className="animate-spin" />
                Loading...
              </Button>
            ) : (
              <Button
                type="submit"
                className="bg-slate-100 text-slate-800 hover:bg-slate-200  "
              >
                Submit
              </Button>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

interface VehicleFormFieldProps {
  name: FieldPath<z.infer<typeof carSchema>>;
  label: string;
  placeholder: string;
  description?: string;
  inputType?: string;
  formControl: Control<z.infer<typeof carSchema>, any>;
}

const VehicleFormField = ({
  name,
  label,
  placeholder,
  description,
  inputType,
  formControl,
}: VehicleFormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {inputType === "file" ? (
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => field.onChange(e.target.files)}
                ref={field.ref}
                name={field.name}
                className="bg-slate-50 bg-opacity-[3%] border-none "
              />
            ) : (
              <Input
                type={inputType || "text"}
                placeholder={placeholder}
                {...field}
                className="border-transparent bg-slate-50/[3%] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [appearance:textfield]"
              />
            )}
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

interface ComboBoxFieldProps {
  formControl: Control<z.infer<typeof carSchema>, any>;
  name: FieldPath<z.infer<typeof carSchema>>;
  label: string;
  options: string[];
  type: "make" | "model";
  disabled?: boolean;
}

const ComboBoxField = ({
  formControl,
  name,
  label,
  options,
  type,
  disabled = false,
}: ComboBoxFieldProps) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-between bg-slate-50/[3%] dark:bg-slate-50/[3%] dark:border-none dark:hover:bg-slate-50/[6%] dark:hover:text-slate-200 border-none hover:bg-opacity-[6%] hover:text-slate-200",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value || `Select ${type}`}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder={`Search ${type}...`} />
                <CommandEmpty>No {type} found.</CommandEmpty>

                <ScrollArea type="scroll" className="max-h-48 overflow-y-auto">
                  <CommandGroup className="">
                    {options.map((option) => (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => {
                          field.onChange(option);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            option === field.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

const VehicleSelectField = ({
  formControl,
  name,
  label,
  placeholder,
  description,
}: VehicleFormFieldProps) => {
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }: any) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <SelectTrigger className="dark:bg-slate-50/[3%] bg-slate-50/[3%] dark:border-none border-none dark:focus:ring-0 focus:ring-0 dark:focus:border-teal-500 focus:border-teal-500 dark:hover:bg-slate-50/[5%] hover:bg-slate-50 hover:bg-opacity-[10%] transition">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent className="bg-neutral-900 border-none text-slate-50">
                {name === "transmission" ? (
                  <>
                    <SelectItem
                      value="Manual"
                      className="data-[highlighted]:bg-slate-500 data-[highlighted]:bg-opacity-[10%] data-[highlighted]:text-slate-50"
                    >
                      Manual
                    </SelectItem>
                    <SelectItem
                      value="Automatic"
                      className="data-[highlighted]:bg-slate-500 data-[highlighted]:bg-opacity-[10%] data-[highlighted]:text-slate-50"
                    >
                      Automatic
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem
                      value="Petrol"
                      className="data-[highlighted]:bg-slate-500 data-[highlighted]:bg-opacity-[10%] data-[highlighted]:text-slate-50"
                    >
                      Petrol
                    </SelectItem>
                    <SelectItem
                      value="Diesel"
                      className="data-[highlighted]:bg-slate-500 data-[highlighted]:bg-opacity-[10%] data-[highlighted]:text-slate-50"
                    >
                      Diesel
                    </SelectItem>
                    <SelectItem
                      value="Electric"
                      className="data-[highlighted]:bg-slate-500 data-[highlighted]:bg-opacity-[10%] data-[highlighted]:text-slate-50"
                    >
                      Electric
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
export default VehicleForm;
