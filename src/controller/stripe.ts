import Stripe from 'stripe';
import { Request, Response } from 'express';
import { stripe } from '../lib/stripe';
import { ConfirmSubscriptionPaymentService, FailedSubscriptionPaymentService } from '../service/subscription';

export const stripeWebhook = async (req: Request, res: Response) => {
    const sig = req.headers['stripe-signature']!;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
    }

    if (event.type === 'invoice.payment_failed') {
        console.log('Estou recebendo o webhook de falha no pagamento 🔥')
        const invoice = event.data.object as any;
        try {
            const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
            console.log(subscription)
            const restaurant_id = parseInt(subscription.metadata.restaurant_id);
            await FailedSubscriptionPaymentService(restaurant_id, invoice.id);
            return res.json({ received: true });
        } catch (error: any) {
            console.log(error);
        }
    }
    if (event.type === 'invoice.paid') {
        console.log('Recebido invoice.paid 🔥');
        const invoice = event.data.object as any;

        const subscriptionId = invoice.parent?.subscription_details?.subscription;

        // Recupera a assinatura completa
        await stripe.subscriptions.retrieve(subscriptionId);
        const restaurant_id = parseInt(invoice.parent?.subscription_details?.metadata?.restaurant_id);
        await ConfirmSubscriptionPaymentService(restaurant_id, subscriptionId);

        return res.json({ received: true });


        res.status(200).send('ok');
    }
}