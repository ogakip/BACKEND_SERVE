import { Table } from "../entities/tables";
import { AppDataSource } from "../database/datasource";
import { TableProps } from "../interfaces/tables";

const tableRepo = AppDataSource.getRepository(Table)

export const RegTableService = async () => {
    await tableRepo.save({})

    return { message: "Mesa criada com sucesso" }
}

export const UpdTableService = async ({ id, client }: TableProps) => {
    if (client) {
        await tableRepo.update(id, {
            client
        })
    } else {
        await tableRepo.update(id, {
            client: undefined,
            status: "empty"
        })
    }
}

export const DeleteTableService = async () => {

}