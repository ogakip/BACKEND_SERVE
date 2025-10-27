import { AddRecipeToOrder } from "./../controller/orders";
import { Between } from "typeorm";
import { AppDataSource } from "../database/datasource";
import { OrderStatus, OrderType, Restaurant_Order } from "../entities/orders";
import { PlanType } from "../entities/plans";
import { Restaurant_Recipe } from "../entities/recipe";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { CREATE_DELIVERY_ORDER_DETAILS_PROPS, CREATE_LOCAL_ORDER_DETAILS_PROPS, CREATE_ORDER_PROPS } from "../interfaces";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";
import { checkIfTableExists } from "../middlewares/findTable";
import { Order_Recipes } from "../entities/orderRecipes";
import { Delivery_Order_Details } from "../entities/deliveryOrderDetails";
import { Local_Order_Details } from "../entities/localOrderDetails";

const OrderRepository = AppDataSource.getRepository(Restaurant_Order);
const RecipeRepository = AppDataSource.getRepository(Restaurant_Recipe);
const OrderRecipeRepository = AppDataSource.getRepository(Order_Recipes);
const DeliveryOrderDetailsRepository = AppDataSource.getRepository(Delivery_Order_Details);
const LocalOrderDetailsRepository = AppDataSource.getRepository(Local_Order_Details);

export const CreateOrderService = async (
  OrderData: CREATE_ORDER_PROPS,
  restaurant_id: number
) => {
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

  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

  const latestOrders = await OrderRepository.count({
    where: {
      owner: { id: restaurant_id },
      created_at: Between(oneHourAgo, now),
    },
  });

  if (latestOrders >= findSubscription.plan.features.maxHourlyOrders) {
    throw new AppError(
      `Limite de ${findSubscription.plan.features.maxHourlyOrders} pedidos por hora atingido. Tente novamente mais tarde.`
    );
  }

  const newOrder = OrderRepository.create({
    owner: findRestaurant,
    type: getOrderType(),
    status: OrderStatus.PENDING,
    total_value: 0,
  });

  await OrderRepository.save(newOrder);

  return { message: messages.SUCCESSFUL_REGISTER, order_id: newOrder.id };
};

export const CreateDeliveryDetailsService = async (order_id: number, DeliveryDetails: CREATE_DELIVERY_ORDER_DETAILS_PROPS) => {
  const existingOrder = await OrderRepository.findOneBy({ id: order_id });
  const hasDeliveryDetails = await DeliveryOrderDetailsRepository.findOneBy({ order: { id: order_id } });

  if (hasDeliveryDetails) {
    throw new AppError(messages.DELIVERY_DETAILS_ALREADY_EXISTS);
  }

  if (!existingOrder) {
    throw new AppError(messages.ORDER_NOT_FOUND);
  }

  const newDeliveryDetails = DeliveryOrderDetailsRepository.create({
    order: existingOrder,
    delivery_address: DeliveryDetails.delivery_address,
    delivery_number: DeliveryDetails.delivery_number,
    delivery_district: DeliveryDetails.delivery_district,
    delivery_complement: DeliveryDetails.delivery_complement,
    client_name: DeliveryDetails.client_name,
    client_phone: DeliveryDetails.client_phone,
    observations: DeliveryDetails.observations,
  });
  await DeliveryOrderDetailsRepository.save(newDeliveryDetails);

  return { message: messages.SUCCESSFUL_EDIT, details_id: newDeliveryDetails.id};
};

export const CreateLocalDetailsService = async (order_id: number, table_id: number, LocalDetails: CREATE_LOCAL_ORDER_DETAILS_PROPS) => {
  const existingOrder = await OrderRepository.findOneBy({ id: order_id });
  const table = await checkIfTableExists(table_id);
  const hasLocalDetails = await LocalOrderDetailsRepository.findOneBy({ order: { id: order_id } });

  if (hasLocalDetails) {
    throw new AppError(messages.LOCAL_DETAILS_ALREADY_EXISTS);
  }

  if (!existingOrder) {
    throw new AppError(messages.ORDER_NOT_FOUND);
  }

  if (!table) {
    throw new AppError(messages.TABLE_NOT_FOUND);
  }

  const newLocalDetails = LocalOrderDetailsRepository.create({
    order: existingOrder,
    table: table,
    observations: LocalDetails.observations || "",
    client_name: LocalDetails.client_name || "",
  });
  await LocalOrderDetailsRepository.save(newLocalDetails);

  return { message: messages.SUCCESSFUL_EDIT, details_id: newLocalDetails.id };
};

export const ChangeOrderStatusService = async (
  status: OrderStatus,
  order_id: number
) => {
  const existingOrder = await OrderRepository.findOneBy({ id: order_id });

  if (!existingOrder) {
    throw new AppError(messages.ORDER_NOT_FOUND);
  }

  if (status === OrderStatus.DONE) {
    existingOrder.status = OrderStatus.DONE;
    existingOrder.finished_at = new Date();
  } else {
    existingOrder.status = status;
  }

  console.log(status)

  await OrderRepository.save(existingOrder);

  return {
    message: messages.SUCCESSFUL_EDIT,
    order_id: existingOrder.id,
    status: existingOrder.status,
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
      order: { created_at: "DESC" },
    }),

    OrderRepository.count({
      where: {
        owner: { id: restaurant_id },
        created_at: Between(oneHourAgo, now),
      },
    }),
  ]);

  const adjustToBrazilTime = (date: Date | null) => {
    if (!date) return null;
    const brTime = new Date(date.getTime() - 3 * 60 * 60 * 1000); // UTC-3
    return brTime;
  };

  const formattedOrders = orders.map((order) => ({
    id: order.id,
    type: order.type,
    status: order.status,
    created_at: adjustToBrazilTime(order.created_at),
    finished_at: adjustToBrazilTime(order.finished_at),
  }));

  return {
    data: formattedOrders,
    total: hourlyCount,
    max: subscription.plan.features.maxHourlyOrders,
  };
};

export const AddRecipeToOrderService = async (
  order_id: number,
  recipe_id: number,
  restaurant_id: number,
  quantity: number
) => {
  const order = await OrderRepository.findOne({
    where: { id: order_id, owner: { id: restaurant_id } },
  });
  const recipe = await RecipeRepository.findOne({
    where: { id: recipe_id, owner: { id: restaurant_id } },
    relations: ['ingredients', 'ingredients.Ingredients']
  });

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND);
  }

  if (!recipe) {
    throw new AppError(messages.RECIPE_NOT_FOUND);
  }

  const qty = quantity && Number(quantity) > 0 ? Number(quantity) : 1;

  if (!Number.isInteger(qty) || qty < 1) {
    throw new AppError("Quantidade inválida");
  }

  // montar snapshot de ingredientes
  const snapshotIngredients = recipe.ingredients?.map((ri) => ({
    ingredient_id: ri.Ingredients?.id,
    name: ri.Ingredients?.title,
    quantity: Number(ri.quantity),
    unit: ri.Ingredients?.unit_type,
  })) || [];

  const snapshotValue = Number(recipe.value);
  const totalValue = Number((snapshotValue * qty).toFixed(2));

  const orderRecipe = OrderRecipeRepository.create({
    order,
    recipe,
    quantity: qty,
    snapshot_title: recipe.title,
    snapshot_value: snapshotValue,
    snapshot_ingredients: snapshotIngredients,
    total_value: totalValue,
  });

  await OrderRecipeRepository.save(orderRecipe);

  await OrderRepository.update(order.id, {
    total_value: Number((order.total_value + totalValue).toFixed(2)),
  });

  return {
    message: messages.SUCCESSFUL_REGISTER,
    order_recipe_id: orderRecipe.id,
  };
};

export const RemoveRecipeFromOrderService = async (
  order_recipe_id: number,
  restaurant_id: number
) => {
  const restaurant = await checkIfRestaurantExists(restaurant_id);
  const orderRecipe = await OrderRecipeRepository.findOne({
    where: { id: order_recipe_id, owner: { id: restaurant.id } },
  });

  if (!orderRecipe) {
    throw new AppError(messages.ORDER_RECIPE_NOT_FOUND);
  }

  await OrderRepository.update(orderRecipe.order.id, {
    total_value: Number(
      (orderRecipe.order.total_value - orderRecipe.total_value).toFixed(2)
    ),
  });

  await OrderRecipeRepository.remove(orderRecipe);

  return { message: messages.SUCCESSFUL_REGISTER };
};

export const ListOrderRecipesService = async (
  order_id: number,
  restaurant_id: number
) => {
  const order = await OrderRepository.findOne({
    where: { id: order_id, owner: { id: restaurant_id } },
  });

  if (!order) {
    throw new AppError(messages.ORDER_NOT_FOUND);
  }

  const orderRecipes = await OrderRecipeRepository.find({
    where: { order },
  });

  return orderRecipes;
};

export const ListOrderDetailsService = async (
  order_id: number,
) => {
  let foundDetails;

  const findLocalDetails = await LocalOrderDetailsRepository.findOne({
    where: { id: order_id }, relations: ['table']
  });

  if (findLocalDetails) {
    foundDetails = findLocalDetails;
  }

  const findDeliveryDetails = await DeliveryOrderDetailsRepository.findOne({
    where: { id: order_id },
  });

  if (findDeliveryDetails) {
    foundDetails = findDeliveryDetails;
  }

  if (!foundDetails) {
    throw new AppError(messages.ORDER_DETAILS_NOT_FOUND);
  }

  return foundDetails;
};
