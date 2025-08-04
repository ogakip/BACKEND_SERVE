import { AppDataSource } from "../database/datasource";
import { Recipe_Ingredients } from "../entities/recipeIngredients";
import { Restaurant_Ingredients } from "../entities/ingredients";
import { Restaurant_Recipe } from "../entities/recipe";
import { ADD_INGREDIENT_PROPS, CREATE_RECIPE_PROPS, EDIT_RECIPE_PROPS } from "../interfaces";
import { checkIfRestaurantExists } from "../middlewares/findRestaurant";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import { checkIfSubscriptionsExists } from "../middlewares/findSusbsciprion";

const RecipeIngredientsRepository = AppDataSource.getRepository(Recipe_Ingredients);
const RecipeRepository = AppDataSource.getRepository(Restaurant_Recipe);
const IngredientsRepository = AppDataSource.getRepository(Restaurant_Ingredients);

export const CreateRecipeService = async (RecipeData: CREATE_RECIPE_PROPS, restaurant_id: number) => {
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);

    await RecipeRepository.save({
        ...RecipeData,
        owner: findRestaurant
    });

    return { message: messages.SUCCESSFUL_REGISTER };
}

export const AddToRecipeService = async (quantity: number, recipe_id: number, ingredient_id: number, restaurant_id: number) => {
    const findRecipe = await RecipeRepository.findOneBy({ id: recipe_id })
    const findIngredient = await IngredientsRepository.findOneBy({ id: ingredient_id });
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);

    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND)
    }
    if (!findIngredient) {
        throw new AppError(messages.INGREDIENT_NOT_FOUND)
    }

    await RecipeIngredientsRepository.save({
        Ingredients: findIngredient,
        recipe: findRecipe,
        owner: findRestaurant,
        quantity: quantity
    })

    //fazer isso aqui so quando fazer o pedido
    // const newStockValue = findIngredient.unit_value - quantity

    // await IngredientsRepository.update(findIngredient.id, { unit_value: newStockValue })

    return { message: messages.ADD_INGREDIENT_RECIPE }
}

export const ListRecipeIngredientsService = async (recipe_id: number, restaurant_id: number) => {
    const findSubscription = await checkIfSubscriptionsExists(restaurant_id);
    const findRecipe = await RecipeRepository.findOneBy({ id: recipe_id })

    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND)
    }

    const ingredientsList = await RecipeIngredientsRepository.find({ where: { recipe: findRecipe }, relations: ["Ingredients"] })

    return ingredientsList
}

export const EditRecipeService = async (EditRecipeData: EDIT_RECIPE_PROPS, recipe_id: number) => {
    const findRecipe = await RecipeRepository.findOneBy({ id: recipe_id });

    if (!findRecipe) {
        throw new AppError(messages.RECIPE_NOT_FOUND)
    }

    await RecipeRepository.update(recipe_id, EditRecipeData);

    return { message: messages.SUCCESSFUL_EDIT }
}

export const RemoveFromRecipeService = async (recipe_ingredient_id: number) => {
    const findIngredientRecipe = await RecipeIngredientsRepository.findOneBy({ id: recipe_ingredient_id });

    if (!findIngredientRecipe) {
        throw new AppError(messages.RECIPE_INGREDIENT_NOT_FOUND)
    }

    await RecipeIngredientsRepository.delete(findIngredientRecipe.id);

    return { message: messages.SUCCESSFUL_DELETE_RECIPE_INGREDIENT }
}

export const ListAllRecipesService = async (restaurant_id: number) => {
    const findRestaurant = await checkIfRestaurantExists(restaurant_id);
    const findSubscription = await checkIfSubscriptionsExists(restaurant_id);
    const findAllRecipes = await RecipeRepository.find({ where: { owner: findRestaurant } })

    return {
        data: findAllRecipes,
        max: findSubscription.plan.features.maxRecipes,
        total: findAllRecipes.length
    }
}