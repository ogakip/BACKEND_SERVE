import { AppDataSource } from "../database/datasource";
import { Plans } from "../entities/plans";
import { Licenses } from "../entities/licenses";
import { Subscriptions } from "../entities/subscriptions";
import { checkIfPlanExists } from "../middlewares/findPlan";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { messages } from "../errors/messages";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { v4 as uuidv4 } from "uuid";

const PlansRepository = AppDataSource.getRepository(Plans)
const LicensesRepository = AppDataSource.getRepository(Licenses)
const SubscriptionsRepository = AppDataSource.getRepository(Subscriptions)

export const ListAllPlansService = async () => {
    const getAll = await PlansRepository.find();

    return getAll
}

export const CreateSubscriptionService = async (restaurant_id: number, plan_id: number) => {
    const findPlan = await checkIfPlanExists(plan_id);
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);

    await SubscriptionsRepository.save({
        owner: findRestaurant,
        plan: findPlan,
        is_active: false,
    })

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