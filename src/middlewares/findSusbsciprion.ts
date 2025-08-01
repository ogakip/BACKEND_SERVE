import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions } from "../entities/subscriptions";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { checkIfRestaurantExists } from "./findRestaurant";

const SubscriptionRepository = AppDataSource.getRepository(Restaurant_Subscriptions);

export const checkIfSubscriptionsExists = async (restaurant_id: number) => {
    const findSubscription = await SubscriptionRepository.findOne({
        where: { owner: { id: restaurant_id } },
        relations: ['plan'],
        order: { created_at: 'DESC' },
    });
    if (!findSubscription) {
        throw new AppError(messages.SUBSCRIPTION_NOT_FOUND);
    }

    return findSubscription
}