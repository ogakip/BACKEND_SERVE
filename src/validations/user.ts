import * as yup from "yup";

export const createUserSchema = yup.object({
    username: yup.string().required("Nome de usuário é obrigatório"),
    password: yup.string().required("Senha obrigatória"),
    is_admin: yup.boolean().default(false).required('Tipo de usuário é obrigatório'),
    is_active: yup.boolean().default(false).required('Usuário está ativo é obrigatório')
}).noUnknown();

export const loginUserSchema = yup.object({
    username: yup.string().required("Nome de usuário é obrigatório"),
    password: yup.string().required("Senha obrigatória"),
}).noUnknown();