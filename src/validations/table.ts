import * as yup from "yup";

export const CreateTableSchema = yup
  .object({
    title: yup
      .string()
      .required("O nome da mesa é obrigatório")
  })
  .noUnknown();

export const SetClientSchema = yup
  .object({
    client: yup
      .string()
      .transform((value) => (value === "" ? null : value))
      .nullable(),
  })
  .noUnknown();
