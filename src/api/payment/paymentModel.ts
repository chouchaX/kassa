import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

import { commonValidations } from "@/common/utils/commonValidation";

extendZodWithOpenApi(z);

const itemSchema = z.object({
  description: z.string().min(1, "Description must not be empty"),
  quantity: z.number().positive("Quantity must be a positive number"),
  amount: z.string(), 
});

export const PaymentSchema = z.object({
  amount: z.number(),
  id:  z.string(), 
  email:  z.string(), 
  items: z.array(itemSchema).default([]),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Payment = z.infer<typeof PaymentSchema>;

// Input Validation for 'POST payment/:amount' endpoint
export const CreatePaymentSchema = z.object({
  body: z.object({
    amount: commonValidations.amount,
    id: commonValidations.id, 
    email: commonValidations.email, 
    items: commonValidations.items,
  }),
});

export const GetPaymentStatusSchema = z.object({
  params: z.object({
    paymentId: z.string().uuid("Invalid paymentId format"), 
  }),
});
