import { Router } from "express";
import { CreateRestaurant, EditRestaurant, LoginRestaurant } from "../controller/restaurant";
import { verifyToken } from "../middlewares/auth";
import { verifySubscriptionStatus } from "../middlewares/verifySubscriptionStatus";
import { CreateTable, DeleteTable, EditTable } from "../controller/tables";
import { ChangeIngredient, CreateIngredient, DeleteIngredient } from "../controller/ingredients";
import { isTableOwner } from "../middlewares/isTableOwner";
import { isIngredientOwner } from "../middlewares/isIngredientOwner";

export const RestaurantRoutes = Router();

RestaurantRoutes.post('/register', CreateRestaurant);
RestaurantRoutes.post('/login', LoginRestaurant);
RestaurantRoutes.patch('/edit', verifyToken, EditRestaurant)

RestaurantRoutes.post('/tables', verifyToken, verifySubscriptionStatus, CreateTable)
RestaurantRoutes.patch('/tables/:table_id', verifyToken, verifySubscriptionStatus, EditTable)
RestaurantRoutes.delete('/tables/:table_id', verifyToken, verifySubscriptionStatus, isTableOwner, DeleteTable)

RestaurantRoutes.post('/ingredient', verifyToken, verifySubscriptionStatus, CreateIngredient)
RestaurantRoutes.post('/ingredient/:ingredient_id', verifyToken, verifySubscriptionStatus, isIngredientOwner, DeleteIngredient)
RestaurantRoutes.patch('/ingredient/:ingredient_id', verifyToken, verifySubscriptionStatus, isIngredientOwner, ChangeIngredient)