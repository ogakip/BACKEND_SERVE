import * as yup from "yup";
import { OrderStatus, OrderType } from "../entities/orders";

export const CreateOrderSchema = yup.object({
  type: yup.mixed<OrderType>()
    .oneOf(Object.values(OrderType))
    .notRequired(),
}).noUnknown();

export const changeOrderStatusSchema = yup.object({
  status: yup
    .mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus) as OrderStatus[], "Status inválido")
    .required("Status é obrigatório")
});

export const CreateOrderItemSchema = yup.object({
  quantity: yup.number()
    .typeError('Quantidade deve ser um número')
    .integer('Quantidade deve ser um inteiro')
    .min(1, 'Quantidade mínima é 1')
    .required('Quantidade é obrigatória'),
}).noUnknown();

export const CreateLocalDetailsSchema = yup.object({
  client_name: yup.string()
    .max(100, 'Nome do cliente deve ter no máximo 100 caracteres')
    .required('Nome do cliente é obrigatório'),
  observations: yup.string()
    .max(255, 'Observações devem ter no máximo 255 caracteres')
}).noUnknown();

export const CreateDeliveryDetailsSchema = yup.object({
  address: yup.string()
    .max(255, 'Endereço deve ter no máximo 255 caracteres')
    .required('Endereço é obrigatório'),
  number: yup.string()
    .max(100, 'Número deve ter no máximo 100 caracteres')
    .required('Número é obrigatório'),
  district: yup.string()
    .max(100, 'Bairro deve ter no máximo 100 caracteres')
    .required('Bairro é obrigatório'),
  complement: yup.string()
    .max(100, 'Complemento deve ter no máximo 100 caracteres')
    .notRequired(),
  client_name: yup.string()
    .max(100, 'Nome do cliente deve ter no máximo 100 caracteres')
    .required('Nome do cliente é obrigatório'),
  client_phone: yup.string()
    .max(15, 'Telefone do cliente deve ter no máximo 15 caracteres')
    .required('Telefone do cliente é obrigatório'),
  observations: yup.string()
    .max(255, 'Observações devem ter no máximo 255 caracteres')
    .notRequired(),
}).noUnknown();
