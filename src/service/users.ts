import { AppDataSource } from "../database/datasource";
import { Users } from "../entities/users";
import { AppError } from "../errors/appError";
import { compare, hash } from "bcrypt";
import jwt from "jsonwebtoken";
import { CancUserProps, LogUserProps, RegUserProps, UpdUserPros } from "../interfaces/users";

export const RegUserService = async ({ username, password }: RegUserProps) => {
    const userRepo = AppDataSource.getRepository(Users);

    const userExists = await userRepo.findOneBy({ username });

    if (userExists) {
        throw new AppError("Usuário já cadastrado.");
    }

    const hashedPassword = await hash(password, 10);

    await userRepo.save({
        username,
        pass: hashedPassword
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

export const UpdUserService = async ({ id, password }: UpdUserPros) => {
    const userRepo = AppDataSource.getRepository(Users);

    const userExists = await userRepo.findOneBy({ id });

    if (!userExists) {
        throw new AppError("Usuário não cadastrado.");
    }

    const hashedPassword = await hash(password, 10);

    await userRepo.update(id, {
        password: hashedPassword,
    });
}

export const ListAllUserService = async () => {
    const userRepo = AppDataSource.getRepository(Users);

    const users = await userRepo.find();

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
