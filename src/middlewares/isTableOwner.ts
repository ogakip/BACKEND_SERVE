import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { Restaurant_Tables } from "../entities/tables";

const TableRepository = AppDataSource.getRepository(Restaurant_Tables);

export const isTableOwner = async (req: Request, res: Response, next: NextFunction) => {
    const { restaurant_id } = res.locals;
    const { table_id } = req.params;

    const findTable = await TableRepository.findOne({
        where: { id: Number(table_id) },
        relations: ["owner"]
    });

    if (!findTable) {
        throw new AppError(messages.TABLE_NOT_FOUND);
    }

    if (findTable.owner.id !== restaurant_id) {
        throw new AppError(messages.IS_NOT_OWNER);
    }

    next();
};
