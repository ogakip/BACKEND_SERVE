import { Request, Response, NextFunction } from "express";
import { ValidationError, ObjectSchema } from "yup";
import { AppError } from "../errors/appError";

export const schemaValidation =
  (schema: ObjectSchema<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = await schema.validate(req.body);
      let invalidFields = [];

      for (let i in req.body) {
        if (!Object.keys(validation).some((key) => key === i)) {
          invalidFields.push(i);
        }
      }

      if (invalidFields.length > 0) {
        throw new ValidationError(
          invalidFields.length > 1
            ? `${invalidFields.join(", ")} são campos inválidos`
            : `${invalidFields[0]} é um campo inválido`
        );
      }

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        throw new AppError(error.errors.join("; "));
      }
    }
  };
