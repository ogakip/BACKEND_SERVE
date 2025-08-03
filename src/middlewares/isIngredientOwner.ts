import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { Restaurant_Ingredients } from "../entities/ingredients";

const IngredientRepository = AppDataSource.getRepository(Restaurant_Ingredients);

export const isIngredientOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurant_id } = res.locals;
    const { ingredient_id } = req.params;

    const findIngredient = await IngredientRepository.findOne({
        where: { id: Number(ingredient_id) },
        relations: ["owner"]
    });

    if (!findIngredient) {
        throw new AppError(messages.INGREDIENT_NOT_FOUND);
    }

    if (findIngredient.owner.id !== restaurant_id) {
        throw new AppError(messages.IS_NOT_OWNER);
    }

    next();
};
