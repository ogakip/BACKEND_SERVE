import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions } from "../entities/subscriptions";
import { Restaurant_Tables, TableStatus } from "../entities/tables";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";

export const CreateTableService = async (restaurant_id: number) => {
    const getTablesRepository = AppDataSource.getRepository(Restaurant_Tables);
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
    const findSubscriptions = await checkIfSubscriptionsExists(restaurant_id);

    if (!findSubscriptions) {
        throw new AppError(messages.SUBSCRIPTION_NOT_FOUND);
    }

    const countTables = await getTablesRepository.find({ where: { owner: findRestaurant } })

    if (countTables.length === findSubscriptions.plan.features.maxTables) {
        throw new AppError(messages.MAX_TABLES_LENGTH);
    }

    const newTable = getTablesRepository.create({
        owner: findRestaurant,
        status: TableStatus.EMPTY
    })

    await getTablesRepository.save(newTable);

    return { message: messages.SUCCESSFUL_REGISTER }
}