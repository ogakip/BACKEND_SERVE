import { Request, Response } from "express";
import { CreateTableService, EditTableService } from "../service/tables";

export const CreateTable = async (req: Request, res: Response) => {
    const { restaurant_id } = res.locals;

    const service = await CreateTableService(restaurant_id);

    return res.status(201).json(service);
}

export const EditTable = async (req: Request, res: Response) => {
    const { table_id } = req.params;
    const { client } = req.body

    const service = await EditTableService(client, Number(table_id));

    return res.status(200).json(service);
}