import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { Restaurant_Order } from "../entities/orders";

const OrderRepository = AppDataSource.getRepository(Restaurant_Order);

export const isOrderOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurant_id } = res.locals;
    const { order_id } = req.params;

    const findOrder = await OrderRepository.findOne({
        where: { id: Number(order_id) },
        relations: ["owner"]
    });

    if (!findOrder) {
        throw new AppError(messages.ORDER_NOT_FOUND);
    }

    if (findOrder.owner.id !== restaurant_id) {
        throw new AppError(messages.IS_NOT_OWNER);
    }

    next();
};
