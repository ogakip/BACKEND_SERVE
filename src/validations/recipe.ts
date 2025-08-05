import * as yup from "yup";

export const CreateRecipeSchema = yup.object({
  title: yup.string()
    .required("O título da receita é obrigatório")
    .min(2, "O título deve ter pelo menos 2 caracteres"),

  description: yup.string()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .notRequired(),

  value: yup.number()
    .typeError("Valor da receita deve ser um número")
    .required("O valor da receita é obrigatório")
    .min(0, "Valor deve ser maior ou igual a 0"),

  offer: yup.number()
    .typeError("Valor de oferta deve ser um número")
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .min(0, "Valor da oferta deve ser maior ou igual a 0")
    .notRequired()
}).noUnknown();

export const AddIngredientToRecipeSchema = yup.object({
  quantity: yup.number()
    .typeError("Quantidade deve ser um número")
    .required("A quantidade do ingrediente é obrigatória")
    .moreThan(0, "Quantidade deve ser maior que 0")
}).noUnknown();

export const EditRecipeSchema = yup.object({
  title: yup.string()
    .min(2, "O título deve ter pelo menos 2 caracteres")
    .notRequired(),

  description: yup.string()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .notRequired(),

  value: yup.number()
    .typeError("O valor deve ser um número")
    .min(0, "Valor deve ser maior ou igual a 0")
    .notRequired(),

  offer: yup.number()
    .typeError("O valor de oferta deve ser um número")
    .min(0, "Oferta deve ser maior ou igual a 0")
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .notRequired()
}).noUnknown();