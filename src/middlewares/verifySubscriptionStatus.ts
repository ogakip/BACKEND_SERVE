import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions, SubscriptionStatus } from "../entities/subscriptions";
import { checkIfSubscriptionsExists } from "./findSusbsciprion";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { Subscriptions_Licenses } from "../entities/licenses";
import { checkIfRestaurantExists } from "./findRestaurant";

const LicensesRepository = AppDataSource.getRepository(Subscriptions_Licenses);

export const verifySubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = res.locals.restaurant_id;

    const findSubscription = await checkIfSubscriptionsExists(restaurantId);
    const findRestaurant = await checkIfRestaurantExists(restaurantId);
    const findLicense = await LicensesRepository.findOneBy({ owner: findRestaurant });

    const hasActiveLicense = findLicense && findLicense.owner?.id === findRestaurant.id && findLicense.is_active;
    const hasActiveSubscription = findSubscription && findSubscription.status === SubscriptionStatus.ACTIVE;

    if (hasActiveLicense || hasActiveSubscription) {
        return next();
    }

    throw new AppError(messages.UNAUTHORIZED);
};
