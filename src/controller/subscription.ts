import { Request, Response } from "express";
import { ListAllPlansService } from "../service/subscription";

export const ListAllPlans = async (req: Request, res: Response) => {
    const response = await ListAllPlansService();

    return res.status(200).json(response);
}