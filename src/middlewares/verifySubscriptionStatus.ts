import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions, SubscriptionStatus } from "../entities/subscriptions";
import { checkIfSubscriptionsExists } from "./findSusbsciprion";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";

export const verifySubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
    const findSubscription = await checkIfSubscriptionsExists(res.locals.restaurant_id);

    if (!findSubscription || findSubscription.status !== SubscriptionStatus.ACTIVE) {
        throw new AppError(messages.UNAUTHORIZED);
    }

    next();
};