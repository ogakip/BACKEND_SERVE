import { Router } from "express";
import {
  CancelSubscription,
  CreateSubscription,
  GetUserSubscription,
  ListAllPlans,
} from "../controller/subscription";
import { verifyToken } from "../middlewares/auth";

export const SubscriptionsRoutes = Router();

SubscriptionsRoutes.get("/plans", ListAllPlans);
SubscriptionsRoutes.get("/", verifyToken, GetUserSubscription);
SubscriptionsRoutes.post("/register/:id", verifyToken, CreateSubscription);
SubscriptionsRoutes.patch("/cancel", verifyToken, CancelSubscription);
