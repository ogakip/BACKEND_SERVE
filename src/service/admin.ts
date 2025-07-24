import { compare, hash } from "bcrypt";
import { AppDataSource } from "../database/datasource";
import { Admins } from "../entities/admin";
import { Plans } from "../entities/plans";
import { AppError } from "../errors/appError";
import { messages } from "../errors/messages";
import jwt from "jsonwebtoken";
import { CREATE_ADMIN_PROPS, CREATE_PLAN_PROPS, EDIT_PLAN_PROPS, LOGIN_ADMIN_PROPS } from "../interfaces";
import { checkIfAdminExists } from "../middlewares/findAdmin";
import { stripe } from "../lib/stripe";

const AdminsRepository = AppDataSource.getRepository(Admins)
const PlansRepository = AppDataSource.getRepository(Plans)

export const buildUpdateObject = (body: EDIT_PLAN_PROPS) => {
    return Object.entries(body).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null) {
            acc[key as keyof EDIT_PLAN_PROPS] = value
        }
        return acc
    }, {} as EDIT_PLAN_PROPS)
}

export const CreateAdminService = async (AdminData: CREATE_ADMIN_PROPS) => {
    const { username, password } = AdminData;

    const findAdmin = await AdminsRepository.findOneBy({ username })

    if (findAdmin) {
        throw new AppError(messages.REGISTER_ALREADY_EXISTS)
    }

    const hashPassword = await hash(password, 10)

    await AdminsRepository.save({
        username,
        password: hashPassword
    })

    return { message: messages.SUCCESSFUL_REGISTER }
}

export const LoginAdminService = async (LoginAdminData: LOGIN_ADMIN_PROPS) => {
    const { username, password } = LoginAdminData;

    const findAdmin = await AdminsRepository.findOneBy({ username })

    if (!findAdmin) {
        throw new AppError(messages.ADMIN_LOGIN_ERROR)
    }

    const comparePassword = await compare(password, findAdmin.password);

    if (!comparePassword) {
        throw new AppError(messages.ADMIN_LOGIN_ERROR)
    }

    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT Secret inválido ou não definido.");
    }

    const accessToken = jwt.sign({ admin_id: findAdmin.id }, jwtSecret, {
        expiresIn: "7d"
    });

    return {
        accessToken
    }
}

export const CreatePlanService = async (admin_id: number, PlanData: CREATE_PLAN_PROPS) => {
    const { title, description, features, price, recurrence, type } = PlanData;

    await checkIfAdminExists(admin_id)

    const product = await stripe.products.create({
        name: title,
        description
    });

    const priceObj = await stripe.prices.create({
        unit_amount: Math.round(price * 100),
        currency: 'brl',
        recurring: {
            interval: recurrence === "monthly" ? "month" : "year",
        },
        product: product.id,
    });

    await PlansRepository.save({
        title,
        description,
        features,
        price,
        recurrence,
        type,
        stripe_product_id: product.id,
        stripe_price_id: priceObj.id,
    });

    return { message: messages.SUCCESSFUL_REGISTER }
}

export const EditPlanService = async (admin_id: number, plan_id: number, EditPlanData: EDIT_PLAN_PROPS) => {
    await checkIfAdminExists(admin_id)

    await PlansRepository.update(plan_id, buildUpdateObject(EditPlanData));

    return { message: messages.SUCCESSFUL_EDIT }
}

export const DeletePlanService = async (admin_id: number, plan_id: number) => {
    await checkIfAdminExists(admin_id)

    await PlansRepository.delete(plan_id)

    return
}