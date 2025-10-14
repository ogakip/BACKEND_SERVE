import { Restaurant } from './../entities/restaurants';
import { AppDataSource } from "../database/datasource";
import { AppError } from '../errors/appError';
import { messages } from '../errors/messages';

const RestaurantRepository = AppDataSource.getRepository(Restaurant);

export const checkIfRestaurantExists = async (restaurant_id: number) => {
    if (restaurant_id === undefined || restaurant_id === null || Number.isNaN(Number(restaurant_id))) {
        throw new AppError(messages.RESTAURANT_NOT_FOUND);
    }
    const findRestaurant = await RestaurantRepository.findOneBy({ id: restaurant_id })

    if (!findRestaurant) {
        throw new AppError(messages.RESTAURANT_NOT_FOUND);
    }

    return findRestaurant
}