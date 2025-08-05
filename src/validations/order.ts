import * as yup from "yup";
import { OrderStatus, OrderType } from "../entities/orders";

export const CreateOrderSchema = yup.object({
  recipe_id: yup.number()
    .typeError("ID da receita deve ser um número")
    .required("A receita é obrigatória"),

  type: yup.mixed<OrderType>()
    .oneOf(Object.values(OrderType))
    .notRequired(),

  table_id: yup.number()
    .typeError("ID da mesa deve ser um número")
    .when("type", {
      is: OrderType.LOCAL,
      then: (schema) => schema.required("A mesa é obrigatória para pedidos locais"),
      otherwise: (schema) => schema.notRequired()
    })
});

export const changeOrderStatusSchema = yup.object({
  new_status: yup
    .mixed<OrderStatus>()
    .oneOf(Object.values(OrderStatus) as OrderStatus[], "Status inválido")
    .required("Status é obrigatório")
});
