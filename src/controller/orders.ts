import { Request, Response } from "express";
import { AddRecipeToOrderService, ChangeOrderStatusService, CreateDeliveryDetailsService, CreateLocalDetailsService, CreateOrderService, ListAllOrdersService, ListOrderDetailsService, ListOrderRecipesService, RemoveRecipeFromOrderService } from "../service/orders";

export const CreateOrder = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateOrderService(req.body, restaurant_id);

    return res.status(201).json(service);
}

export const CreateDeliveryDetails = async (req: Request, res: Response) => {
    const { order_id } = req.params;

    const service = await CreateDeliveryDetailsService(Number(order_id), req.body);

    return res.status(201).json(service);
}

export const CreateLocalDetails = async (req: Request, res: Response) => {
    const { order_id, table_id } = req.params;

    const service = await CreateLocalDetailsService(Number(order_id), Number(table_id), req.body);

    return res.status(201).json(service);
}

export const ChangeOrderStatus = async (req: Request, res: Response) => {
    const { order_id } = req.params;

    const service = await ChangeOrderStatusService(req.body.status, Number(order_id));

    return res.status(200).json(service);
}

export const ListAllOrders = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await ListAllOrdersService(restaurant_id);

    return res.status(200).json(service);
}

export const AddRecipeToOrder = async (req: Request, res: Response) => {
    const { order_id, recipe_id } = req.params;
    const { restaurant_id } = res.locals;
    
    const response = await AddRecipeToOrderService(Number(order_id), Number(recipe_id), restaurant_id, req.body.quantity);

    return res.status(201).json(response);
}

export const RemoveRecipeFromOrder = async (req: Request, res: Response) => {
    const { order_recipe_id } = req.params;
    const { restaurant_id } = res.locals;

    const response = await RemoveRecipeFromOrderService(Number(order_recipe_id), restaurant_id);

    return res.status(200).json(response);
}

export const ListOrderRecipes = async (req: Request, res: Response) => {
    const { order_id } = req.params;
    const { restaurant_id } = res.locals;

    const response = await ListOrderRecipesService(Number(order_id), restaurant_id);

    return res.status(200).json(response);
}

export const ListOrderDetails = async (req: Request, res: Response) => {
    const { order_id } = req.params;

    const response = await ListOrderDetailsService(Number(order_id));

    return res.status(200).json(response);
}