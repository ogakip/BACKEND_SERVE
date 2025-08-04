import { AppDataSource } from "../database/datasource";
import { Restaurant_Tables } from "../entities/tables";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";

export const checkIfTableExists = async (table_id: number) => {
    const getTablesRepository = AppDataSource.getRepository(Restaurant_Tables);

    const findTable = await getTablesRepository.findOne({ where: { id: table_id }, relations: ["owner"] });

    if (!findTable) {
        throw new AppError(messages.TABLE_NOT_FOUND)
    }

    return findTable;
}