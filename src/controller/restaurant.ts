import { Request, Response } from "express";
import { CreateRestaurantService, LoginRestaurantService } from "../service/restaurant";

export const CreateRestaurant = async (req: Request, res: Response) => {
    const service = await CreateRestaurantService(req.body);

    return res.status(201).json(service);
}

export const LoginRestaurant = async (req: Request, res: Response) => {
    const service = await LoginRestaurantService(req.body);

    return res.status(201).json(service);
}