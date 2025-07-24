import mercadopago from 'mercadopago';
import { CREATE_PLAN_PROPS } from '../interfaces';

export const CreatePaymentLinkService = async (PlanData: CREATE_PLAN_PROPS) => {
  const { title, price,  } = PlanData;

  const preference = {
    items: [
      {
        title: 'Plano Mensal Chefia',
        quantity: 1,
        currency_id: 'BRL',
        unit_price: 39.90,
      },
    ],
    back_urls: {
      success: 'http://localhost:3000/sucesso',
      failure: 'http://localhost:3000/falha',
      pending: 'http://localhost:3000/pendente',
    },
    auto_return: 'approved',
    metadata: {
      plano_id: 1,
      restaurant_id: 42,
    },
  };

  const response = await mercadopago.preferences.create(preference);
  return response.body.init_point;
};
