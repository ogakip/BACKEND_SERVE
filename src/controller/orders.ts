import { Request, Response } from "express";
import { ChangeOrderStatusService, CreateOrderService, ListAllOrdersService } from "../service/orders";

export const CreateOrder = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateOrderService(req.body, restaurant_id);

    return res.status(201).json(service);
}

export const ChangeOrderStatus = async (req: Request, res: Response) => {
    const { order_id } = req.params;

    const service = await ChangeOrderStatusService(req.body.new_status, Number(order_id));

    return res.status(200).json(service);
}

export const ListAllOrders = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await ListAllOrdersService(restaurant_id);

    return res.status(200).json(service);
}