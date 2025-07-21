import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { handleAppErrorMiddleware } from "./middlewares/handleAppError";
import { MercadoPagoWebhook } from "./service/mp";

export const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/mercadopago", MercadoPagoWebhook);
app.use(handleAppErrorMiddleware);