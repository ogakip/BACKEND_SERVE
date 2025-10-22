import { Router } from "express";
import { CreateRestaurant, EditRestaurant, LoginRestaurant, LogoutRestaurant, ValidateSession } from "../controller/restaurant";
import { verifyToken } from "../middlewares/auth";
import { verifySubscriptionStatus } from "../middlewares/verifySubscriptionStatus";
import { CreateTable, DeleteTable, EditTable, ListAllTables } from "../controller/tables";
import { ChangeIngredient, CreateIngredient, DeleteIngredient, ListIngredients } from "../controller/ingredients";
import { isTableOwner } from "../middlewares/isTableOwner";
import { isIngredientOwner } from "../middlewares/isIngredientOwner";
import { AddToRecipe, CreateRecipe, EditRecipe, ListAllRecipes, ListRecipeIngredients, RemoveFromRecipe } from "../controller/recipes";
import { isRecipeOwner } from "../middlewares/isRecipeOwner";
import { ChangeOrderStatus, CreateOrder, ListAllOrders } from "../controller/orders";
import { isOrderOwner } from "../middlewares/isOrderOwner";
import { schemaValidation } from "../middlewares/yupValidator";
import { CreateRestaurantSchema, EditRestaurantSchema, LoginRestaurantSchema } from "../validations/restaurant";
import { CreateTableSchema, SetClientSchema } from "../validations/table";
import { CreateIngredientSchema, EditIngredientSchema } from "../validations/ingredient";
import { AddIngredientToRecipeSchema, CreateRecipeSchema, EditRecipeSchema } from "../validations/recipe";
import { changeOrderStatusSchema, CreateOrderSchema } from "../validations/order";

export const RestaurantRoutes = Router();

RestaurantRoutes.post('/register', schemaValidation(CreateRestaurantSchema), CreateRestaurant);
RestaurantRoutes.post('/login', schemaValidation(LoginRestaurantSchema), LoginRestaurant);
RestaurantRoutes.get('/validate-session', verifyToken, ValidateSession);
RestaurantRoutes.delete('/logout', verifyToken, LogoutRestaurant);
RestaurantRoutes.patch('/edit', verifyToken, schemaValidation(EditRestaurantSchema), EditRestaurant);

RestaurantRoutes.post('/tables', verifyToken, schemaValidation(CreateTableSchema), verifySubscriptionStatus, CreateTable)
RestaurantRoutes.get('/tables', verifyToken, verifySubscriptionStatus, ListAllTables)
RestaurantRoutes.patch('/tables/:table_id', verifyToken, schemaValidation(SetClientSchema), verifySubscriptionStatus, EditTable)
RestaurantRoutes.delete('/tables/:table_id', verifyToken, verifySubscriptionStatus, isTableOwner, DeleteTable)

RestaurantRoutes.post('/ingredient', verifyToken, schemaValidation(CreateIngredientSchema), verifySubscriptionStatus, CreateIngredient)
RestaurantRoutes.delete('/ingredient/:ingredient_id', verifyToken, verifySubscriptionStatus, isIngredientOwner, DeleteIngredient)
RestaurantRoutes.patch('/ingredient/:ingredient_id', verifyToken, schemaValidation(EditIngredientSchema), verifySubscriptionStatus, isIngredientOwner, ChangeIngredient)
RestaurantRoutes.get('/ingredients', verifyToken, verifySubscriptionStatus, ListIngredients)

RestaurantRoutes.post('/recipe', verifyToken, schemaValidation(CreateRecipeSchema), verifySubscriptionStatus, CreateRecipe)
RestaurantRoutes.get('/recipe', verifyToken, verifySubscriptionStatus, ListAllRecipes)
RestaurantRoutes.post('/recipe/:recipe_id/:ingredient_id', verifyToken, verifySubscriptionStatus, isRecipeOwner, isIngredientOwner, AddToRecipe)
RestaurantRoutes.get('/recipe/ingredients/:recipe_id', verifyToken, schemaValidation(AddIngredientToRecipeSchema), verifySubscriptionStatus, isRecipeOwner, ListRecipeIngredients)
RestaurantRoutes.patch('/recipe/:recipe_id', verifyToken, schemaValidation(EditRecipeSchema), verifySubscriptionStatus, isRecipeOwner, EditRecipe)
RestaurantRoutes.post('/recipe/:recipe_id/recipe_ingredients/:recipe_ingredient_id', verifyToken, verifySubscriptionStatus, isRecipeOwner, RemoveFromRecipe)

RestaurantRoutes.get('/order', verifyToken, verifySubscriptionStatus, ListAllOrders)
RestaurantRoutes.post('/order', verifyToken, schemaValidation(CreateOrderSchema), verifySubscriptionStatus, CreateOrder)
RestaurantRoutes.patch('/order/:order_id', verifyToken, schemaValidation(changeOrderStatusSchema), verifySubscriptionStatus, isOrderOwner, ChangeOrderStatus)