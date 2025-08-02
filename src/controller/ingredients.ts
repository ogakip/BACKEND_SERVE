import { Request, Response } from "express";
import { CreateIngredientService } from "../service/ingredients";

export const CreateIngredient = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateIngredientService(req.body, Number(restaurant_id));

    return res.status(201).json(service);
}