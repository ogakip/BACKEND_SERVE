import { AppDataSource } from "../database/datasource";
import { Restaurant_Subscriptions } from "../entities/subscriptions";
import { Restaurant_Tables, TableStatus } from "../entities/tables";
import { OrderStatus, Restaurant_Order } from "../entities/orders";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { checkIfTableExists } from "../middlewares/findTable";
import { In } from "typeorm";

const getTablesRepository = AppDataSource.getRepository(Restaurant_Tables);
const getOrderRepository = AppDataSource.getRepository(Restaurant_Order);

export const CreateTableService = async (title: string, restaurant_id: number) => {
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
        status: TableStatus.EMPTY,
        title
    })
    
    await getTablesRepository.save(newTable)
    
    return { message: messages.SUCCESSFUL_REGISTER }
}

export const EditTableService = async (new_client: string, table_id: number) => {
    await checkIfTableExists(table_id);

    if (new_client) {
        await getTablesRepository.update(table_id, { client: new_client, status: TableStatus.BUSY })
    } else {
        await getTablesRepository.update(table_id, { client: null, status: TableStatus.EMPTY })
    }

    return { message: messages.SUCCESSFUL_EDIT };
}

export const DeleteTableService = async (table_id: number) => {
    const findTable = await checkIfTableExists(table_id);

    if (findTable.client) {
        throw new AppError(messages.BUSY_TABLE_ERROR)
    }

    const activeOrdersOnTable = await getOrderRepository.findOneBy({ table: findTable, status: In([OrderStatus.PENDING, OrderStatus.PREPARING, OrderStatus.TRANSPORT]) })

    if (activeOrdersOnTable) {
        throw new AppError(messages.TABLE_HAVE_ORDERS_ERROR)
    }

    await getTablesRepository.delete(table_id);

    return { message: messages.SUCCESSFUL_DELETE_TABLE }
}

export const ListAllTablesService = async (restaurant_id: number) => {
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
    const findTables = await getTablesRepository.find({ where: { owner: findRestaurant } });
    const findSubscription = await checkIfSubscriptionsExists(restaurant_id);

    return {
        data: findTables,
        max: findSubscription.plan.features.maxTables,
        total: findTables.length
    }
}