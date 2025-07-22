import { AppDataSource } from "../database/datasource";
import { Plans } from "../entities/plans";
import { Licenses } from "../entities/licenses";
import { Subscriptions } from "../entities/subscriptions";
import { checkIfPlanExists } from "../middlewares/findPlan";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { messages } from "../errors/messages";

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