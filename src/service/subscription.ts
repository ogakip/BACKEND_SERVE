import { AppDataSource } from "../database/datasource";
import { Plans } from "../entities/plans";
import { Subscriptions_Licenses } from "../entities/licenses";
import { Restaurant_Subscriptions } from "../entities/subscriptions";
import { checkIfPlanExists } from "../middlewares/findPlan";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { messages } from "../errors/messages";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../lib/stripe";

const PlansRepository = AppDataSource.getRepository(Plans)
const LicensesRepository = AppDataSource.getRepository(Subscriptions_Licenses)
const SubscriptionsRepository = AppDataSource.getRepository(Restaurant_Subscriptions)

export const ListAllPlansService = async () => {
    const getAll = await PlansRepository.find();

    return getAll
}

export const CreateSubscriptionService = async (restaurant_id: number, plan_id: number) => {
    const findPlan = await checkIfPlanExists(plan_id);
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);

    try {
        const session = await stripe.checkout.sessions.create({
            mode: 'subscription',
            line_items: [
                {
                    price: findPlan.stripe_price_id, // ID do preço
                    quantity: 1,
                },
            ],
            customer_email: findRestaurant.email,
            success_url: 'https://www.google.com/',
            cancel_url: 'https://www.google.com/#',
            metadata: {
                restaurant_id: String(findRestaurant.id)
            }
        });

        console.log('URL pra pagar:', session.url);

        // await stripe.paymentMethods.attach(paymentMethod.id, {
        //     customer: customer.id,
        // });

        // const subscription = await stripe.subscriptions.create({
        //     customer: customer.id,
        //     items: [{ price: findPlan.stripe_price_id }],
        //     payment_behavior: 'default_incomplete',
        //     expand: ['latest_invoice.payment_intent'],
        // });
        // console.log('✅ Subscription criada:', subscription.id);
        // console.log('📌 Status do pagamento:', subscription.latest_invoice);

    } catch (error: any) {
        console.error('❌ Erro geral:', error.message || error);
    }

    await SubscriptionsRepository.save({
        owner: findRestaurant,
        plan: findPlan,
        is_active: false,
    })

    // const subscription = await stripe.subscriptions.create({
    //     customer: customer.id,
    //     items: [
    //         {
    //             price: findPlan.stripe_price_id, // ID do price criado no plano
    //         },
    //     ],
    //     payment_settings: {
    //         payment_method_types: ['card'],
    //         save_default_payment_method: 'on_subscription',
    //     },
    //     expand: ['latest_invoice.payment_intent'],
    // });

    return { message: messages.SUCCESSFUL_SUBSCRIPTION }
}

export const FakeSubscriptionConfirmService = async (restaurant_id: number) => {
    const findSubscription = await checkIfSubscriptionsExists(restaurant_id);
    const findPlan = await checkIfPlanExists(findSubscription.plan.id);

    const numLicenses = findPlan.features.num_licenses;

    const licensesToCreate = Array.from({ length: numLicenses }).map(() =>
        LicensesRepository.create({
            key: uuidv4(),
            subscription: findSubscription,
            is_active: true
        })
    );

    await LicensesRepository.save(licensesToCreate);
    await SubscriptionsRepository.update(findSubscription.id, { is_active: true })

    console.log('Inscrição confirmada com sucesso 🚀🔥')

    return { message: messages.SUCCESSFUL_REGISTER }
}

export const CancelSubscriptionService = async (restaurant_id: number) => {
    const subscription = await checkIfSubscriptionsExists(restaurant_id);

    // Desativa as licenças da assinatura
    const licenses = await LicensesRepository.find({ where: { subscription } });

    for (const license of licenses) {
        license.is_active = false;
        license.owner = null;
    }

    await LicensesRepository.save(licenses);

    await SubscriptionsRepository.remove(subscription);

    return { message: messages.SUCCESSFUL_CANCEL_SUBSCRIPTION };
};