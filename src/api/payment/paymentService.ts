import { StatusCodes } from "http-status-codes";
import axios from 'axios'
import uuid from 'generate-unique-id'

import { logger } from "@/server";
import { SECRET_KEY, SHOP_ID } from "@/common/constants/yookassa";
import { ServiceResponse } from "@/common/models/serviceResponse";

type Items = { description: string; quantity: number; amount: string }[]

type Response = {
  "id": "23d93cac-000f-5000-8000-126628f15141",
  "status": "pending",
  "paid": false,
  "confirmation": {
    "type": "redirect",
    "confirmation_url": "https://yoomoney.ru/api-pages/v2/payment-confirm/epl?orderId=23d93cac-000f-5000-8000-126628f15141"
  },
  "test": false
}

export class PaymentService {
  constructor() {}

  async createPayment(amount: number, id: string, email: string, items: Items): Promise<ServiceResponse<string | null>> {
    try {
      const { data } = await axios.post<Response>('https://api.yookassa.ru/v3/payments', {
        amount: {
          value: `${amount}`,
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://mergersandacquis.com"
        },
        capture: true,
        description: "Заказ M&A",
        metadata: {
          order_id: `${id}`,
        },
        receipt: {
          customer: {
            email: `${email}`,
          },
          items: items.map((item) => ({
            description: `${item.description}`,
            quantity: item.quantity,
            amount: {
              value: `${item.amount}`,
              currency: "RUB"
            },
            vat_code: 1, 
            payment_mode: "full_prepayment",
            payment_subject: "marked",
            mark_mode: 0,
            mark_code_info: {
              gs_1m: "DFGwNDY0MDE1Mzg2NDQ5MjIxNW9vY2tOelDFuUFwJh05MUVFMDYdOTJXK2ZaMy9uTjMvcVdHYzBjSVR3NFNOMWg1U2ZLV0dRMWhHL0UrZi8ydkDvPQ=="
            },
            measure: "piece"
          }))
        }
      }, {
        headers: {
          'Idempotence-Key': uuid(),
        },
        auth: {
          username: `${SHOP_ID}`,
          password: `${SECRET_KEY}`,
        }
      })

      if (!data.confirmation.confirmation_url) {
        return ServiceResponse.failure("Payment failed", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<string>("Payment success", data.confirmation.confirmation_url);

    } catch (ex) {
      const errorMessage = `Error finding payment:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding payment.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }

  async getPaymentStatus(paymentId: string): Promise<ServiceResponse<string | null>> {
    try {
      const {data} = await axios.get(`https://api.yookassa.ru/v3/payments/${paymentId}`, {
        auth: {
          username: `${SHOP_ID}`, 
          password: `${SECRET_KEY}`,    
        }
      });
      console.log('data.status', data.status );

      if (!data.status) {
        return ServiceResponse.failure("Payment status not found", null, StatusCodes.NOT_FOUND);
      }
      
      return ServiceResponse.success<string>("Payment status received", data.status);

    } catch (ex) {
      const errorMessage = `Error getting payment status:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while retrieving payment status.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const paymentService = new PaymentService();
