import { Router } from "express";
import { CancelSubscription, CreateSubscription, ListAllPlans } from "../controller/subscription";
import { verifyToken } from "../middlewares/auth";

export const SubscriptionsRoutes = Router()

SubscriptionsRoutes.get('/plans', ListAllPlans);
SubscriptionsRoutes.post('/register/:id', verifyToken, CreateSubscription);
SubscriptionsRoutes.patch('/cancel', verifyToken, CancelSubscription);