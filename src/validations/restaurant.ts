import * as yup from "yup";

export const CreateRestaurantSchema = yup.object({
    fullname: yup.string()
        .required("Nome completo é obrigatório")
        .min(3, "Nome deve ter pelo menos 3 caracteres"),

    username: yup.string()
        .required("Usuário é obrigatório")
        .min(4, "Usuário deve ter pelo menos 4 caracteres"),

    email: yup.string()
        .required("E-mail é obrigatório")
        .email("E-mail inválido"),

    password: yup.string()
        .required("Senha é obrigatória")
        .min(6, "Senha deve ter no mínimo 6 caracteres"),

    phone: yup.string()
        .nullable()
        .matches(/^55\d{10,11}$/
            , "Telefone inválido. Use o formato DDI + DDD + número, ex: 5544000000000")
        .transform((value, originalValue) => originalValue === "" ? null : value),

    type: yup.mixed<"matriz" | "filial" | "none">()
        .oneOf(["matriz", "filial", "none"], "Tipo inválido")
        .nullable(),

    branch_code: yup.string()
        .nullable()
        .when("type", {
            is: "filial",
            then: schema => schema.required("Código da licença é obrigatório para filiais"),
            otherwise: schema => schema.notRequired()
        }),

    street: yup.string().nullable(),
    number: yup.string().nullable(),
    district: yup.string().nullable(),
    city: yup.string().nullable(),
    state: yup.string().nullable(),
    zip_code: yup.string().nullable()
}).noUnknown();

export const EditRestaurantSchema = yup.object({
  fullname: yup.string()
    .min(3, "Nome deve ter pelo menos 3 caracteres")
    .notRequired(),

  password: yup.string()
    .min(6, "Senha deve ter no mínimo 6 caracteres")
    .notRequired(),

  phone: yup.string()
    .nullable()
    .matches(/^55\d{10,11}$/, "Telefone inválido. Use o formato DDI + DDD + número, ex: 5544000000000")
    .transform((value, originalValue) => originalValue === "" ? null : value)
    .notRequired(),

  street: yup.string().notRequired(),
  number: yup.string().notRequired(),
  district: yup.string().notRequired(),
  city: yup.string().notRequired(),
  state: yup.string().notRequired(),
  zip_code: yup.string().notRequired()
}).noUnknown();

export const LoginRestaurantSchema = yup.object({
  email: yup.string()
    .email("E-mail inválido")
    .notRequired(),

  username: yup.string()
    .notRequired(),

  password: yup.string()
    .required("Senha é obrigatória")
    .min(6, "Senha deve ter no mínimo 6 caracteres")
}).test("email-or-username", "Informe o e-mail ou o nome de usuário", function (value) {
  if (!value?.email && !value?.username) {
    return this.createError({ message: "Você deve informar e-mail ou nome de usuário" });
  }
  return true;
}).noUnknown();