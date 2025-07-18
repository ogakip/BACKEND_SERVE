import { AppDataSource } from "../database/datasource";
import { Users } from "../entities/users";
import { AppError } from "../errors/appError";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { CancUserProps, LogUserProps, RegUserProps, UpdUserProps } from "../interfaces/users";

export const RegUserService = async ({ username, password, is_admin }: RegUserProps) => {
    const userRepo = AppDataSource.getRepository(Users);

    const userExists = await userRepo.findOneBy({ username });

    if (userExists) {
        throw new AppError("Usuário já cadastrado.");
    }


    const hashedPassword = await hash(password, 10);

    await userRepo.save({
        username,
        password: hashedPassword,
        is_active: true,
        is_admin
    });

    return { message: "Usuário cadastrado com sucesso." };
}

export const LogUserService = async ({ username, password }: LogUserProps) => {
    const userRepo = AppDataSource.getRepository(Users);

    const userExists = await userRepo.findOneBy({ username });

    if (!userExists) {
        throw new AppError("Usuário não cadastrado.");
    }

    const comparePassword = await compare(password, userExists.password);

    if (!userExists || !comparePassword) {
        throw new AppError("Usuário não cadastrado ou senha incorreta.");
    }

    const accessToken = jwt.sign({ user_id: userExists.id }, 'SECRET_KEY', {
        expiresIn: "7d"
    });

    return {
        accessToken
    }
}

export const UpdUserService = async ({ id, password, is_admin, is_active }: UpdUserProps) => {
    const userRepo = AppDataSource.getRepository(Users);

    const user = await userRepo.findOneBy({ id });
    if (!user) {
        throw new AppError("Usuário não cadastrado.");
    }

    const updatedData: Partial<Users> = {};

    if (password) {
        updatedData.password = await hash(password, 10);
    }

    if (typeof is_admin === "boolean") {
        updatedData.is_admin = is_admin;
    }

    if (typeof is_active === "boolean") {
        updatedData.is_active = is_active;
    }

    await userRepo.update(id, updatedData);

    return { message: "Usuario atualizado com sucesso" }
};

export const ListAllUserService = async () => {
    const userRepo = AppDataSource.getRepository(Users);

    const users = await userRepo.find({
        select: {
            id: true,
            username: true,
            is_admin: true,
            is_active: true,
        },
    });

    return users;
};


export const InativeUserService = async ({ id, is_active }: CancUserProps) => {
    const userRepo = AppDataSource.getRepository(Users);

    const userExists = await userRepo.findOneBy({ id })

    if (!userExists) {
        throw new AppError("Usuário não cadastrado.");
    }

    await userRepo.update(id, {
        is_active,
    });

    return;
};
