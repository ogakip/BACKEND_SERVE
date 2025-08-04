import { AppDataSource } from "../database/datasource";
import { Subscriptions_Licenses } from "../entities/licenses";
import { Restaurant_Subscriptions, SubscriptionStatus } from "../entities/subscriptions";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { In } from "typeorm";
import { checkIfRestaurantExists } from "./findRestaurant";

const SubscriptionRepository = AppDataSource.getRepository(Restaurant_Subscriptions);
const LicenseRepository = AppDataSource.getRepository(Subscriptions_Licenses);

export const checkIfSubscriptionsExists = async (restaurant_id: number) => {
    const restaurant = await checkIfRestaurantExists(restaurant_id);

    const subscription = await SubscriptionRepository.findOne({
        where: {
            owner: { id: restaurant.id },
            status: In([
                SubscriptionStatus.ACTIVE,
                SubscriptionStatus.PENDING,
                SubscriptionStatus.NOTPAID
            ])
        },
        relations: ['plan'],
        order: { created_at: 'DESC' },
    });

    if (subscription) {
        return subscription;
    }

    // 2. Se não achou, tenta ver se é uma filial com licença válida
    const license = await LicenseRepository.findOne({
        where: { owner: { id: restaurant.id } },
        relations: ['subscription', 'subscription.plan']
    });

    if (!license || !license.is_active || !license.subscription) {
        throw new AppError(messages.SUBSCRIPTION_NOT_FOUND);
    }

    return license.subscription;
};
