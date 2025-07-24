import Stripe from 'stripe';
import { Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { FakeSubscriptionConfirmService } from '../service/subscription';

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;

        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        // Pega os metadados que você setou na sessão
        const restaurant_id = parseInt(session.metadata?.restaurant_id!);

        // Confirma a assinatura no banco
        await FakeSubscriptionConfirmService(restaurant_id);

        return res.json({ received: true });
    }


    res.status(200).send('ok');
};
