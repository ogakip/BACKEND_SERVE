import { AppDataSource } from "../database/datasource";
import { Restaurant_Ingredients } from "../entities/ingredients";
import { messages } from "../errors/messages";
import { CREATE_INGREDIENT_PROPS } from "../interfaces";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";

const IngredientRepository = AppDataSource.getRepository(Restaurant_Ingredients);

export const CreateIngredientService = async (IngredientData: CREATE_INGREDIENT_PROPS, restaurant_id: number) => {
    const { description, title, unit_type, unit_value } = IngredientData

    const findRestaurant = await checkIfRestaurantExists(restaurant_id);

    await IngredientRepository.save({
        description,
        title,
        unit_type,
        unit_value,
        owner: findRestaurant
    });

    return { message: messages.SUCCESSFUL_REGISTER };
}