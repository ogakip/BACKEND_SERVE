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
            , "Telefone inválido")
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
});
