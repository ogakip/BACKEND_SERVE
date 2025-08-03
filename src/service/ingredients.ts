import { AppDataSource } from "../database/datasource";
import { Restaurant_Ingredients } from "../entities/ingredients";
import { Recipe_Ingredients } from "../entities/recipeIngredients";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { CREATE_INGREDIENT_PROPS } from "../interfaces";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";

const IngredientRepository = AppDataSource.getRepository(Restaurant_Ingredients);
const RecipeIngredientsRepository = AppDataSource.getRepository(Recipe_Ingredients);

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

export const DeleteIngredientService = async (ingredient_id: number) => {
    const findIngredient = await IngredientRepository.findOneBy({ id: ingredient_id })

    if (!findIngredient) {
        throw new AppError(messages.INGREDIENT_NOT_FOUND)
    }
    const findRecipeIngredient = await RecipeIngredientsRepository.findOneBy({ Ingredients: findIngredient })

    if (findRecipeIngredient) {
        throw new AppError(messages.INGREDIENT_HAS_RECIPES)
    }

    await IngredientRepository.delete(ingredient_id);

    return { message: messages.SUCCESSFUL_DELETE_INGREDIENT }
}