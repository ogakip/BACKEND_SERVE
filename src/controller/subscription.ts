import { CancelSubscriptionService, ConfirmSubscriptionPaymentService } from './../service/subscription';
import { Request, Response } from "express";
import { CreateSubscriptionService, ListAllPlansService } from "../service/subscription";

export const ListAllPlans = async (req: Request, res: Response) => {
    const response = await ListAllPlansService();

    return res.status(200).json(response);
}

export const CreateSubscription = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { restaurant_id } = res.locals;

    const response = await CreateSubscriptionService(restaurant_id, Number(id));

    return res.status(201).json(response);
}

export const CancelSubscription = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const response = await CancelSubscriptionService(restaurant_id);
    
    return res.status(200).json(response)
}