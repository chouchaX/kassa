import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";

import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { GetUserSchema, PaymentSchema } from "@/api/user/paymentModel";
import { validateRequest } from "@/common/utils/httpHandlers";
import { paymentController } from "./paymentController";

export const paymentRegistry = new OpenAPIRegistry();
export const paymentRouter: Router = express.Router();

paymentRegistry.register("Payment", PaymentSchema);

paymentRegistry.registerPath({
  method: "get",
  path: "/payment/{amount}",
  tags: ["Payment"],
  request: { params: GetUserSchema.shape.params },
  responses: createApiResponse(PaymentSchema, "Success"),
});

paymentRouter.get("/:amount", validateRequest(GetUserSchema), paymentController.createPayment);
