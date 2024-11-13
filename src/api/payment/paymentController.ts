import type { Request, RequestHandler, Response } from "express";

import { paymentService } from "@/api/user/paymentService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class PaymentController {

  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    const amount = Number.parseInt(req.params.amount as string, 10);
    const serviceResponse = await paymentService.createPayment(amount);
    return handleServiceResponse(serviceResponse, res);
  };
}

export const paymentController = new PaymentController();
