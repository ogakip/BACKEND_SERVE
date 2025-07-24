import { Router } from "express";
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { stripe } from "../lib/stripe";
import { stripeWebhook } from "../controller/stripe";

export const StripeRouter = Router();

StripeRouter.post('/', stripeWebhook)