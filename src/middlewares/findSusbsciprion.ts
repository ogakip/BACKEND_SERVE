import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions, SubscriptionStatus } from "../entities/subscriptions";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { In } from "typeorm";

const SubscriptionRepository = AppDataSource.getRepository(Restaurant_Subscriptions);

export const checkIfSubscriptionsExists = async (restaurant_id: number) => {
    const findSubscription = await SubscriptionRepository.findOne({
        where: { owner: { id: restaurant_id }, status: In([SubscriptionStatus.ACTIVE, SubscriptionStatus.PENDING, SubscriptionStatus.NOTPAID]) },
        relations: ['plan'],
        order: { created_at: 'DESC' },
    });
    if (!findSubscription) {
        throw new AppError(messages.SUBSCRIPTION_NOT_FOUND);
    }

    return findSubscription
}