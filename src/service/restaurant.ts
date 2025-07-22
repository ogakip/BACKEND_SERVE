import { AppDataSource } from "../database/datasource";
import { Restaurant } from "../entities/restaurants";
import { AppError } from "../errors/appError";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

// Interfaces :)
import { CREATE_RESTAURANT_PROPS, EDIT_RESTAURANT_PROPS, LOGIN_RESTAURANT_PROPS } from "../interfaces";
import { messages } from "../errors/messages";

const RestaurantRepository = AppDataSource.getRepository(Restaurant);

export const buildUpdateObject = (body: EDIT_RESTAURANT_PROPS) => {
    return Object.entries(body).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key as keyof EDIT_RESTAURANT_PROPS] = value
        }
        return acc
    }, {} as EDIT_RESTAURANT_PROPS)
}

export const CreateRestaurantService = async (RestaurantData: CREATE_RESTAURANT_PROPS) => {
    const { email, username, password, fullname, phone, city, state, district, street, number, zip_code } = RestaurantData;
    const existingRestaurant = await RestaurantRepository.findOne({
        where: [
            { email },
            { username }
        ]
    });

    if (existingRestaurant) {
        throw new AppError(messages.REGISTER_ALREADY_EXISTS)
    }

    const hashPassword = await hash(password, 10)

    RestaurantRepository.save({
        email,
        username,
        password: hashPassword,
        fullname,
        phone,
        city,
        state,
        district,
        street,
        number,
        zip_code
    })

    return { message: messages.SUCCESSFUL_REGISTER }
}

export const LoginRestaurantService = async (LoginRestaurantData: LOGIN_RESTAURANT_PROPS) => {
    const { email, username, password } = LoginRestaurantData;

    if (!email && !username) {
        throw new AppError("Informe e-mail ou nome de usuário para login.");
    }

    const findRestaurant = email
        ? await RestaurantRepository.findOneBy({ email })
        : await RestaurantRepository.findOneBy({ username });

    if (!findRestaurant) {
        throw new AppError(messages.RESTAURANT_LOGIN_ERROR)
    }

    const comparePassword = await compare(password, findRestaurant.password)

    if (!comparePassword) {
        throw new AppError(messages.RESTAURANT_LOGIN_ERROR)
    }

    const jwtSecret = process.env.CLIENT_JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT Secret inválido ou não definido.");
    }


    const accessToken = jwt.sign({ restaurant_id: findRestaurant.id }, jwtSecret, {
        expiresIn: "7d"
    });

    return {
        accessToken
    }
}

export const EditRestaurantService = async (restaurant_id: number, EditRestaurantData: EDIT_RESTAURANT_PROPS) => {
    const existingRestaurant = await RestaurantRepository.findOneBy({ id: restaurant_id })

    if (!existingRestaurant) {
        throw new AppError(messages.RESTAURANT_NOT_FOUND)
    }

    const updateData = buildUpdateObject(EditRestaurantData)

    await RestaurantRepository.update(restaurant_id, updateData)

    return { message: messages.SUCCESSFUL_EDIT }
}