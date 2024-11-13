import type { Request, RequestHandler, Response } from "express";

import { paymentService } from "@/api/payment/paymentService";
import { handleServiceResponse } from "@/common/utils/httpHandlers";

class PaymentController {

  public createPayment: RequestHandler = async (req: Request, res: Response) => {
    console.log("Request body:", req.body);

    const amount = Number.parseInt(req.body.amount as string, 10);
    const id = req.body.id as string
    const email = req.body.email as string 
    const items = req.body.items
    console.log("Amount:", amount);  
    console.log("ID:", id);
    console.log("Email:", email);
    console.log("Items:", items);

    const serviceResponse = await paymentService.createPayment(amount, id, email, items);
    return handleServiceResponse(serviceResponse, res);
  };

    public getPaymentStatus: RequestHandler = async (req: Request, res: Response) => {
    const paymentId = req.params.paymentId as string;
    const serviceResponse = await paymentService.getPaymentStatus(paymentId);
    return handleServiceResponse(serviceResponse, res);
  };

}

export const paymentController = new PaymentController();
