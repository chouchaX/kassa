import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetPaymentStatusSchema, CreatePaymentSchema, PaymentSchema } from "@/api/payment/paymentModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { paymentController } from "./paymentController";

export const paymentRegistry = new OpenAPIRegistry();
export const paymentRouter: Router = express.Router();

paymentRegistry.register("Payment", PaymentSchema);

//create payment
paymentRegistry.registerPath({
  method: "post",
  path: "/payment",
  tags: ["Payment"],
  request: {
    body: {
      type: "object",
      properties: {
        amount: { type: "number" },
        id: { type: "string" },
        email: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              amount: { type: "string" },
            },
            required: ["description", "quantity", "amount"]
          }
        }
      },
      required: ["amount", "id", "email", "items"]
    }
  },
  responses: createApiResponse(PaymentSchema, "Success"),
});

paymentRouter.post("/", validateRequest(CreatePaymentSchema), paymentController.createPayment);

//get payment status
paymentRegistry.registerPath({
  method: "get",
  path: "/payment/status/{paymentId}",
  tags: ["Payment"],
  request: { params: GetPaymentStatusSchema.shape.params },  
  responses: createApiResponse(PaymentSchema, "Success"),
});

paymentRouter.get("/status/:paymentId", paymentController.getPaymentStatus);