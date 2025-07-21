import { Router } from "express";
import { MercadoPagoWebhook } from "../service/mp";

const router = Router();

router.post("/webhook", MercadoPagoWebhook);

export default router;
