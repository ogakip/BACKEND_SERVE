import { Request, Response } from "express";
import { CreateRestaurantService, EditRestaurantService, LoginRestaurantService } from "../service/restaurant";

export const CreateRestaurant = async (req: Request, res: Response) => {
    const service = await CreateRestaurantService(req.body);

    return res.status(201).json(service);
}

export const LoginRestaurant = async (req: Request, res: Response) => {
    const service = await LoginRestaurantService(req.body);

    return res.status(201).json(service);
}

export const EditRestaurant = async (req: Request, res: Response) => {
    const service = await EditRestaurantService(res.locals.restaurant_id, req.body);

    return res.status(200).json(service);
}