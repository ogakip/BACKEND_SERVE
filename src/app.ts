import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import 'dotenv/config';
import { handleAppErrorMiddleware } from "./middlewares/handleAppError";
import { MercadoPagoWebhook } from "./service/mp";
import { RestaurantRoutes } from "./routers/restaurant";
import { AdminRoutes } from "./routers/admin";

export const app = express();
app.use(express.json());
app.use(cors());
app.use("/admin", AdminRoutes)
app.use("/restaurant", RestaurantRoutes);
app.use("/api/mercadopago", MercadoPagoWebhook);
app.use(handleAppErrorMiddleware);