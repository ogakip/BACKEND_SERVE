import { Request, Response } from "express";
import { AddToRecipeService, CreateRecipeService } from "../service/recipes";

export const CreateRecipe = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const response = await CreateRecipeService(req.body, restaurant_id);

    return res.status(201).json(response);
}

export const AddToRecipe = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;
    const { recipe_id, ingredient_id } = req.params;

    const response = await AddToRecipeService(req.body.quantity, Number(recipe_id), Number(ingredient_id), restaurant_id);

    return res.status(201).json(response)
}