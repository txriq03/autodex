"use client";
import React from "react";
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

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const pinataGateway = "https://aqua-nearby-earwig-269.mypinata.cloud";

const carSchema = z.object({
  make: z.string().nonempty({ message: "Make is required." }),
  model: z.string().nonempty({ message: "Model is required." }),
  year: z
    .coerce
    .number({ invalid_type_error: 'Year must be a number.'})
    .int()
    .min(1886, { message: 'Year must be 1886 or later.'})
    .max(new Date().getFullYear(), {
        message: 'Year cannot be in the future'
    }),
  vin: z
    .string()
    .regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
        message: 'VIN must be 17 capitalised characters (no I, O, or Q)'
    }),
  mileage: z
    .coerce
    .number({ invalid_type_error: "Mileage must be a number." })
    .nonnegative({ message: "Mileage must be 0 or more" }),
  image: z
    .custom<FileList>((val) => val instanceof FileList && val.length > 0, {
      message: "Please upload an image",
    })
    .refine((files) => files[0]?.size <= MAX_FILE_SIZE, {
      message: "File size cannot exceed 5MB",
    })
    .refine((files) => ACCEPTED_IMAGE_TYPES.includes(files[0]?.type), {
      message: "Only .jpg, .jpeg, .png and .webp file formats are supported",
    }),
});

type CarFormData = z.infer<typeof carSchema>;

const VehicleForm = () => {
  const form = useForm<CarFormData>({
    resolver: zodResolver(carSchema),
    defaultValues: {
      make: "",
      model: "",
      vin: "",
      image: undefined,
      year: new Date().getFullYear(),
      mileage: 0
    },
  });
  const uploadToIPFS = async (file: File) => {
    const formData = new FormData();
    console.log("File is", file);
    console.log("Type:", typeof file);
    console.log("Instanceof File:", file instanceof File);
    formData.append("network", "public");
    formData.append("file", file);

    fetch("/api/ipfs", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((err) => console.error(err));
  };

  const onSubmit = async (data: CarFormData) => {
    try {
      const imageUrl = await uploadToIPFS(data.image[0]);
    } catch (error) {
      console.error("Error uploading image to IPFS:", error);
    }
  };

  return (
    <Card className="max-w-[700px] mx-auto">
      <CardHeader>
        <CardTitle>Vehicle information</CardTitle>
        <CardDescription>
          We need information to put up your vehicle in the marketplace.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="grid w-full items-center gap-4">
            <VehicleFormField
              name="make"
              label="Make"
              placeholder="Toyota"
              inputType="text"
              formControl={form.control}
            />
            <VehicleFormField
              name="model"
              label="Model"
              placeholder="Supra"
              inputType="text"
              formControl={form.control}
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
              name="mileage"
              label="Mileage"
              placeholder="20,000"
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
            <Button type="submit">Submit</Button>
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
                />
            ) : (
                <Input
                  type={inputType || "text"}
                  placeholder={placeholder}
                  {...field}
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
export default VehicleForm;
