import { Router } from "express";
import { ListAllPlans } from "../controller/subscription";
import { verifyToken } from "../middlewares/auth";

export const SubscriptionsRoutes = Router()

SubscriptionsRoutes.get('/plans', ListAllPlans);