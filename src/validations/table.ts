import * as yup from "yup";

export const CreateTableSchema = yup.object({
  title: yup.string()
    .required("O nome da mesa é obrigatório")
    .min(2, "O nome da mesa deve ter pelo menos 2 caracteres"),
}).noUnknown();

export const SetClientSchema = yup.object({
  client: yup.string().min(2, "O nome do cliente deve ter pelo menos 2 caracteres"),
}).noUnknown();