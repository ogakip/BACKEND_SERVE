import { Request, Response } from "express";
import { CreateTableService } from "../service/tables";

export const CreateTable = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateTableService(restaurant_id);

    return res.status(201).json(service);
}