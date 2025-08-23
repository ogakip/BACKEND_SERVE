import { AppDataSource } from "../database/datasource";
import { Plans } from "../entities/plans";
import { Subscriptions_Licenses } from "../entities/licenses";
import {
  Restaurant_Subscriptions,
  SubscriptionStatus,
} from "../entities/subscriptions";
import { checkIfPlanExists } from "../middlewares/findPlan";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { messages } from "../errors/messages";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { v4 as uuidv4 } from "uuid";
import { stripe } from "../lib/stripe";
import { AppError } from "../errors/appError";
import { addMonths } from "date-fns";
import { Restaurant, RestaurantType } from "../entities/restaurants";

const RestaurantRepository = AppDataSource.getRepository(Restaurant);
const PlansRepository = AppDataSource.getRepository(Plans);
const LicensesRepository = AppDataSource.getRepository(Subscriptions_Licenses);
const SubscriptionsRepository = AppDataSource.getRepository(
  Restaurant_Subscriptions
);

export const ListAllPlansService = async () => {
  const getAll = await PlansRepository.find();

  return getAll;
};

export const GetUserSubscriptionService = async (restaurant_id: number) => {
  const subscription = await checkIfSubscriptionsExists(restaurant_id);

  return subscription
};

export const CreateSubscriptionService = async (
  restaurant_id: number,
  plan_id: number
) => {
  const findPlan = await checkIfPlanExists(plan_id);
  const findRestaurant = await checkIfRestaurantExists(restaurant_id);

  const newSubscription = SubscriptionsRepository.create({
    owner: findRestaurant,
    plan: findPlan,
    status: SubscriptionStatus.PENDING,
  });

  let checkoutTest;

  await SubscriptionsRepository.save(newSubscription);

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: findPlan.stripe_price_id,
          quantity: 1,
        },
      ],
      customer: findRestaurant.stripe_customer_id,
      success_url: "https://www.google.com/",
      cancel_url: "https://www.google.com/#",
      subscription_data: {
        metadata: {
          restaurant_id: `${findRestaurant.id}`,
        },
      },
    });

    if (!session.url) {
      throw new AppError(messages.PAYMENT_LINK_ERROR);
    }

    checkoutTest = session.url;

    await SubscriptionsRepository.update(newSubscription.id, {
      payment_link: session.url,
    });
  } catch (error: any) {
    console.error("Erro geral:", error.message || error);
  }

  // return { message: messages.SUCCESSFUL_SUBSCRIPTION }
  return { payment_link: checkoutTest };
};

export const ConfirmSubscriptionPaymentService = async (
  restaurant_id: number,
  subscription_id: string
) => {
  try {
    const subscription = await checkIfSubscriptionsExists(restaurant_id);
    const plan = await checkIfPlanExists(subscription.plan.id);

    const now = new Date();
    const monthsToAdd = plan.recurrence === "yearly" ? 12 : 1;
    const expires_at = addMonths(now, monthsToAdd);

    // Verifica se já existem licenças vinculadas
    const existingLicenses = await LicensesRepository.find({
      where: { subscription: { id: subscription.id } },
    });

    if (existingLicenses.length > 0) {
      for (const license of existingLicenses) {
        license.is_active = true;
      }
      await LicensesRepository.save(existingLicenses);
    } else {
      const licensesToCreate = Array.from({
        length: plan.features.num_licenses,
      }).map(() =>
        LicensesRepository.create({
          key: uuidv4(),
          subscription,
          is_active: true,
        })
      );
      await LicensesRepository.save(licensesToCreate);
    }

    await SubscriptionsRepository.update(subscription.id, {
      status: SubscriptionStatus.ACTIVE,
      stripe_subscription_id: subscription_id,
      expires_at,
    });
    await RestaurantRepository.update(restaurant_id, {
      type: RestaurantType.MATRIZ,
    });

    return { message: messages.SUCCESSFUL_REGISTER };
  } catch (error) {
    console.log(error);
  }
};

export const FailedSubscriptionPaymentService = async (
  restaurant_id: number,
  invoice_id: string
) => {
  const subscription = await checkIfSubscriptionsExists(restaurant_id);
  const invoice = await stripe.invoices.retrieve(invoice_id);
  const paymentLink = invoice.hosted_invoice_url;

  await LicensesRepository.update({ subscription }, { is_active: false });
  await SubscriptionsRepository.update(subscription.id, {
    status: SubscriptionStatus.NOTPAID,
    payment_link: paymentLink,
  });

  return { message: messages.SUBSCRIPTION_PAYMENT_FAILED };
};

export const CancelSubscriptionService = async (restaurant_id: number) => {
  const subscription = await checkIfSubscriptionsExists(restaurant_id);

  const licenses = await LicensesRepository.find({
    where: { subscription: { id: subscription.id } },
  });

  if (!subscription.stripe_subscription_id) {
    throw new AppError(messages.SUBSCRIPTION_STRIPE_NOTFOUND);
  }
  await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
  for (const license of licenses) {
    license.is_active = false;
    license.owner = null;
  }

  await LicensesRepository.save(licenses);

  await SubscriptionsRepository.update(subscription.id, {
    status: SubscriptionStatus.CANCELED,
  });

  return { message: messages.SUCCESSFUL_CANCEL_SUBSCRIPTION };
};
