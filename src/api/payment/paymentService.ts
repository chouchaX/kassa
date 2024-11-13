import { StatusCodes } from "http-status-codes";
import axios from 'axios'
import uuid from 'generate-unique-id'

import { ServiceResponse } from "@/common/models/serviceResponse";
import { logger } from "@/server";

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

  async createPayment(amount: number): Promise<ServiceResponse<string | null>> {
    try {
      const { data } = await axios.post<Response>('https://api.yookassa.ru/v3/payments', {
        amount: {
          value: `${amount}`,
          currency: "RUB"
        },
        confirmation: {
          type: "redirect",
          return_url: "https://www.example.com/return_url"
        },
        capture: true,
        description: "Заказ №1"
      }, {
        headers: {
          'Idempotence-Key': uuid(),
          '446093': 'test_ANy6rDbfXAS9Ta2gHWCXvSiuZ3gv7JQkzW_j7jQk9tE'
        }
      })

      if (!data.confirmation.confirmation_url) {
        return ServiceResponse.failure("Payment failed", null, StatusCodes.NOT_FOUND);
      }
      return ServiceResponse.success<string>("Payment success", data.confirmation.confirmation_url);

    } catch (ex) {
      const errorMessage = `Error finding payment:, ${(ex as Error).message}`;
      logger.error(errorMessage);
      return ServiceResponse.failure("An error occurred while finding user.", null, StatusCodes.INTERNAL_SERVER_ERROR);
    }
  }
}

export const paymentService = new PaymentService();
