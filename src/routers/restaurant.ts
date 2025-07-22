import { Router } from "express";
import { CreateRestaurant, LoginRestaurant } from "../controller/restaurant";

export const RestaurantRoutes = Router();

RestaurantRoutes.post('/register', CreateRestaurant);
RestaurantRoutes.post('/login', LoginRestaurant);