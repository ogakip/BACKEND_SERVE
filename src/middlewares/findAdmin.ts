import { AppDataSource } from "../database/datasource"
import { Admins } from "../entities/admin"
import { AppError } from "../errors/appError"
import { messages } from "../errors/messages"

const AdminsRepository = AppDataSource.getRepository(Admins)

export const checkIfAdminExists = async (admin_id: number) => {
    if (!admin_id) {
        throw new AppError(messages.UNAUTHORIZED)
    }

    const findAdmin = await AdminsRepository.findOneBy({ id: admin_id })

    if (!findAdmin) {
        throw new AppError(messages.ADMIN_NOT_FOUND)
    }

    return findAdmin
}