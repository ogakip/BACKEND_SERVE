import * as yup from "yup";

export const CreateIngredientSchema = yup.object({
  title: yup.string()
    .required("O nome do ingrediente é obrigatório")
    .min(2, "O nome do ingrediente deve ter pelo menos 2 caracteres"),

  description: yup.string()
    .nullable()
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .notRequired(),

  unit_type: yup.mixed<"g" | "kg" | "un" | "ml" | "mg" | "l" | "fatia">()
    .oneOf(["g", "kg", "un", "ml", "mg", "l", "fatia"], "Tipo de unidade inválido")
    .required("O tipo de unidade é obrigatório"),

  unit_value: yup.number()
    .typeError("Valor unitário deve ser um número")
    .required("Valor unitário é obrigatório")
    .min(0, "Valor unitário deve ser maior ou igual a 0")
});
