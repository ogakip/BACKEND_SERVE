import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { Restaurant_Recipe } from "../entities/recipe";

const RecipeRepository = AppDataSource.getRepository(Restaurant_Recipe);

export const isRecipeOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurant_id } = res.locals;
    const { recipe_id } = req.params;

    const findRecipe = await RecipeRepository.findOne({
        where: { id: Number(recipe_id) },
        relations: ["owner"]
    });

    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND);
    }

    if (findRecipe.owner.id !== restaurant_id) {
        throw new AppError(messages.IS_NOT_OWNER);
    }

    next();
};
