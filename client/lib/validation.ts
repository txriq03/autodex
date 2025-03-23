import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const carSchema = z.object({
  make: z.string().nonempty({ message: "Make is required." }),
  model: z.string().nonempty({ message: "Model is required." }),
  year: z.coerce
    .number({ invalid_type_error: "Year must be a number." })
    .int()
    .min(1886, { message: "Year must be 1886 or later." })
    .max(new Date().getFullYear(), {
      message: "Year cannot be in the future",
    }),
  vin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/, {
    message: "VIN must be 17 capitalised characters (no I, O, or Q)",
  }),
  mileage: z.coerce
    .number({ invalid_type_error: "Mileage must be a number." })
    .nonnegative({ message: "Mileage must be 0 or more" }),
  registrationNumber: z
    .string()
    .nonempty({ message: "Registration number is required." }),
  transmission: z.enum(["Manual", "Automatic"], {
    required_error: "Transmission type is required.",
    invalid_type_error: "Transmission must be 'Manual' or 'Automatic'",
  }),
  fuelType: z.enum(["Petrol", "Diesel", "Electric"], {
    required_error: "Fuel type is required.",
    invalid_type_error: "Fuel type must be Petrol, Diesel or Electric.",
  }),
  price: z.coerce
    .number({ invalid_type_error: "Price must be a number." })
    .nonnegative({ message: "Price must be positive." }),
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
export type CarFormData = z.infer<typeof carSchema>;

export const logSchema = z.object({
  garage: z.string().min(2, "Garage name is required"),
  mileage: z.coerce.number().min(1, "Mileage must be at least 1"),
  description: z.string().min(5, "Please enter a description"),
});
export type LogFormData = z.infer<typeof logSchema>;

export const addServiceProviderSchema = z.object({
  address: z.string().length(42, "Must be a valid Ethereum address"),
});
