import { AppDataSource } from "../database/datasource";
import { Subscriptions } from "../entities/subscriptions";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { checkIfRestaurantExists } from "./findRestaurant";

const SubscriptionRepository = AppDataSource.getRepository(Subscriptions);

export const checkIfSubscriptionsExists = async (restaurant_id: number) => {
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
    const findSubscription = await SubscriptionRepository.findOne({
        where: { owner: { id: restaurant_id } },
        relations: ['plan'],
    });

    if (!findSubscription) {
        throw new AppError(messages.SUBSCRIPTION_NOT_FOUND);
    }

    return findSubscription
}