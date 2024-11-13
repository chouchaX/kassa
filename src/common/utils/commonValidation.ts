import { z } from "zod";

const itemSchema = z.object({
  description: z.string().min(1, "Description must not be empty"),
  quantity: z.number().positive("Quantity must be a positive number"),
  amount: z.string(), 
});

export const commonValidations = {
  amount: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
    .transform(Number)
    .refine((num) => num > 0, "ID must be a positive number"),
  // ... other common validations
  id: z.string().min(1, "ID must not be empty"),
  email: z.string(),
  items: z.array(itemSchema).default([]),
};
