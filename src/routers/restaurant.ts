import { Router } from "express";
import { CreateRestaurant, EditRestaurant, LoginRestaurant } from "../controller/restaurant";
import { verifyToken } from "../middlewares/auth";
import { verifySubscriptionStatus } from "../middlewares/verifySubscriptionStatus";
import { CreateTable, EditTable } from "../controller/tables";

export const RestaurantRoutes = Router();

RestaurantRoutes.post('/register', CreateRestaurant);
RestaurantRoutes.post('/login', LoginRestaurant);
RestaurantRoutes.patch('/edit', verifyToken, EditRestaurant)

RestaurantRoutes.post('/tables', verifyToken, verifySubscriptionStatus, CreateTable)
RestaurantRoutes.patch('/tables/:table_id', verifyToken, verifySubscriptionStatus, EditTable)