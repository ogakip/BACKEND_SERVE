import { Request, Response } from "express";
import { AddToRecipeService, CreateRecipeService, EditRecipeService, ListAllRecipesService, ListRecipeIngredientsService, RemoveFromRecipeService } from "../service/recipes";

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

export const ListRecipeIngredients = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;
    const { recipe_id } = req.params;

    const service = await ListRecipeIngredientsService(Number(recipe_id), restaurant_id);

    return res.status(200).json(service);
}

export const EditRecipe = async (req: Request, res: Response) => {
    const { recipe_id } = req.params;

    const service = await EditRecipeService(req.body, Number(recipe_id));

    return res.status(200).json(service);
}

export const RemoveFromRecipe = async (req: Request, res: Response) => {
    const { recipe_ingredient_id } = req.params;

    const service = await RemoveFromRecipeService(Number(recipe_ingredient_id));

    return res.status(200).json(service);
}

export const ListAllRecipes = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await ListAllRecipesService(restaurant_id);

    return res.status(200).json(service);
}