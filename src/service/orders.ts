import { Between } from "typeorm";
import { AppDataSource } from "../database/datasource";
import { OrderStatus, OrderType, Restaurant_Order } from "../entities/orders";
import { PlanType } from "../entities/plans";
import { Restaurant_Recipe } from "../entities/recipe";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { CREATE_ORDER_PROPS } from "../interfaces";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { checkIfTableExists } from "../middlewares/findTable";

const OrderRepository = AppDataSource.getRepository(Restaurant_Order);
const RecipeRepository = AppDataSource.getRepository(Restaurant_Recipe);

export const CreateOrderService = async (OrderData: CREATE_ORDER_PROPS, restaurant_id: number) => {
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
    const findRecipe = await RecipeRepository.findOne({
        where: { id: OrderData.recipe_id, owner: { id: restaurant_id } },
        relations: ["owner"]
    });
    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND);
    }

    
    if (findRecipe.owner.id !== restaurant_id) {
        throw new AppError(messages.IS_NOT_OWNER)
    }
    
    const findSubscription = await checkIfSubscriptionsExists(restaurant_id);
    
    const planType = findSubscription.plan.type;
    
    if (planType !== PlanType.FULL && OrderData.type) {
        throw new AppError(messages.ERROR_TYPE_PLAN);
    }
    
    const getOrderType = (): OrderType => {
        if (planType === PlanType.BASIC) return OrderType.LOCAL;
        if (planType === PlanType.DELIVERY) return OrderType.DELIVERY;
        
        if (!OrderData.type) {
            throw new AppError(messages.ORDER_TYPE_EMPTY);
        }
        
        return OrderData.type;
    };
    
    let table = null;
    
    if (OrderData.table_id) {
        table = await checkIfTableExists(OrderData.table_id);
        if (table.owner.id !== restaurant_id) {
            throw new AppError(messages.IS_NOT_OWNER);
        }
    }

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const latestOrders = await OrderRepository.count({
        where: {
            owner: { id: restaurant_id },
            created_at: Between(oneHourAgo, now)
        }
    });

    if (latestOrders >= findSubscription.plan.features.maxHourlyOrders) {
        throw new AppError(`Limite de ${findSubscription.plan.features.maxHourlyOrders} pedidos por hora atingido. Tente novamente mais tarde.`);
    }

    const newOrder = OrderRepository.create({
        owner: findRestaurant,
        table,
        recipe: findRecipe,
        type: getOrderType(),
        status: OrderStatus.PENDING
    });

    await OrderRepository.save(newOrder);

    return { message: messages.SUCCESSFUL_REGISTER, order_id: newOrder.id };
};

export const ChangeOrderStatusService = async (new_status: OrderStatus, order_id: number) => {
    const existingOrder = await OrderRepository.findOneBy({ id: order_id });

    if (!existingOrder) {
        throw new AppError(messages.ORDER_NOT_FOUND);
    }

    if (new_status === OrderStatus.DONE) {
        existingOrder.status = OrderStatus.DONE;
        existingOrder.finished_at = new Date();
    } else {
        existingOrder.status = new_status;
        existingOrder.finished_at = null;
    }

    await OrderRepository.save(existingOrder);

    return {
        message: messages.SUCCESSFUL_EDIT,
        order_id: existingOrder.id,
        status: existingOrder.status
    };
};

export const ListAllOrdersService = async (restaurant_id: number) => {
    const restaurant = await checkIfRestaurantExists(restaurant_id);
    const subscription = await checkIfSubscriptionsExists(restaurant_id);

    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const [orders, hourlyCount] = await Promise.all([
        OrderRepository.find({
            where: { owner: restaurant },
            order: { created_at: "DESC" }
        }),

        OrderRepository.count({
            where: {
                owner: { id: restaurant_id },
                created_at: Between(oneHourAgo, now)
            }
        })
    ]);

    const adjustToBrazilTime = (date: Date | null) => {
        if (!date) return null;
        const brTime = new Date(date.getTime() - 3 * 60 * 60 * 1000); // UTC-3
        return brTime;
    };

    const formattedOrders = orders.map(order => ({
        id: order.id,
        type: order.type,
        status: order.status,
        created_at: adjustToBrazilTime(order.created_at),
        finished_at: adjustToBrazilTime(order.finished_at)
    }));

    return {
        data: formattedOrders,
        total: hourlyCount,
        max: subscription.plan.features.maxHourlyOrders
    };
};
