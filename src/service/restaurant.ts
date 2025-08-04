import { AppDataSource } from "../database/datasource";
import { Restaurant, RestaurantType } from "../entities/restaurants";
import { AppError } from "../errors/appError";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";

// Interfaces :)
import { CREATE_RESTAURANT_PROPS, EDIT_RESTAURANT_PROPS, LOGIN_RESTAURANT_PROPS } from "../interfaces";
import { messages } from "../errors/messages";
import { stripe } from "../lib/stripe";
import { Subscriptions_Licenses } from "../entities/licenses";

const RestaurantRepository = AppDataSource.getRepository(Restaurant);
const LicensesRepository = AppDataSource.getRepository(Subscriptions_Licenses);

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

    const hashPassword = await hash(password, 10);
    let customer;
    try {
        customer = await stripe.customers.create({
            email,
            name: fullname
        });
    } catch (error) {
        console.error('Erro ao criar customer na Stripe:', error);
        throw new AppError('Falha ao registrar cliente na plataforma de pagamentos. Tente novamente mais tarde.');
    }

    const newRestaurant = RestaurantRepository.create({
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
        zip_code,
        stripe_customer_id: customer.id
    });

    if (RestaurantData.branch_code) {
        const findLicense = await LicensesRepository.findOneBy({ key: RestaurantData.branch_code })

        if (!findLicense) {
            throw new AppError(messages.LICENSE_NOT_FOUND)
        }

        if (findLicense.owner) {
            throw new AppError(messages.LICENSE_BUSY)
        }

        
        const savedRestaurant = await RestaurantRepository.save({
            ...newRestaurant,
            branch_code: RestaurantData.branch_code,
            type: RestaurantType.FILIAL
        });
        await LicensesRepository.update(findLicense.id, { owner: savedRestaurant })
    } else {
        await RestaurantRepository.save(newRestaurant);
    }


    try {
        await stripe.customers.update(customer.id, {
            metadata: {
                restaurant_id: newRestaurant.id
            }
        });
    } catch (error) {
        console.warn('Não foi possível atualizar metadata do Stripe:', error);
        // Não precisa falhar a criação por isso, apenas avisa
    }

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