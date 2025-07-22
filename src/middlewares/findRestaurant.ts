import { Restaurant } from './../entities/restaurants';
import { AppDataSource } from "../database/datasource";
import { AppError } from '../errors/appError';
import { messages } from '../errors/messages';

const RestaurantRepository = AppDataSource.getRepository(Restaurant);

export const checkIfRestaurantExists = async (restaurant_id: number) => {
    const findRestaurant = await RestaurantRepository.findOneBy({ id: restaurant_id })

    if (!findRestaurant) {
        throw new AppError(messages.RESTAURANT_NOT_FOUND);
    }

    return findRestaurant
}