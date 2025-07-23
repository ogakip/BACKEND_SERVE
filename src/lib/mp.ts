import { MercadoPagoConfig, PreApprovalPlan, CardToken } from 'mercadopago';

export const mp = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN_TEST || ""
});

export const preApprovalPlan = new PreApprovalPlan(mp);
export const cardToken = new CardToken(mp);