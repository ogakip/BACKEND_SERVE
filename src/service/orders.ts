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
    const findRecipe = await RecipeRepository.findOneBy({ id: OrderData.recipe_id });
    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND);
    }

    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
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
