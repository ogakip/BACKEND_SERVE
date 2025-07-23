import { AppDataSource } from "../database/datasource"
import { Plans } from "../entities/plans"
import { AppError } from "../errors/appError"
import { messages } from "../errors/messages"

const PlansRepository = AppDataSource.getRepository(Plans)

export const checkIfPlanExists = async (plan_id: number) => {
    const findPlan = await PlansRepository.findOneBy({ id: plan_id })

    if (!findPlan) {
        throw new AppError(messages.PLAN_NOT_FOUND)
    }

    return findPlan
}