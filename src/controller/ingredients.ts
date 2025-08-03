import { Request, Response } from "express";
import { ChangeIngredientService, CreateIngredientService, DeleteIngredientService } from "../service/ingredients";

export const CreateIngredient = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateIngredientService(req.body, Number(restaurant_id));

    return res.status(201).json(service);
}

export const ChangeIngredient = async (req: Request, res: Response) => {
    const { ingredient_id } = req.params;

    const service = await ChangeIngredientService(req.body, Number(ingredient_id));

    return res.status(200).json(service);
}

export const DeleteIngredient = async (req: Request, res: Response) => {
    const { ingredient_id } = req.params;

    const service = await DeleteIngredientService(Number(ingredient_id));

    return res.status(200).json(service);
}