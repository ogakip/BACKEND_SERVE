import { Request, Response } from "express";
import { CreateOrderService } from "../service/orders";

export const CreateOrder = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateOrderService(req.body, restaurant_id);

    return res.status(201).json(service);
}