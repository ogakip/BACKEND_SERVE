import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        throw new AppError("Não autorizado", 401);
    }

    const jwtSecret = process.env.CLIENT_JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT Secret inválido ou não definido.");
    }

    const splitToken = accessToken.split(" ");

    jwt.verify(splitToken[1], jwtSecret, (error: any, decoded: any) => {
        if (error) {
            throw new AppError("Token de autorização inválido", 401);
        }

        res.locals.restaurant_id = decoded.restaurant_id;
    });

    next();
};

export const verifyAdminToken = (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        throw new AppError("Não autorizado", 401);
    }

    const jwtSecret = process.env.ADMIN_JWT_SECRET;

    if (!jwtSecret) {
        throw new Error("JWT Secret inválido ou não definido.");
    }

    const splitToken = accessToken.split(" ");

    jwt.verify(splitToken[1], jwtSecret, (error: any, decoded: any) => {
        if (error) {
            throw new AppError("Token de autorização inválido", 401);
        }

        res.locals.admin_id = decoded.admin_id;
    });
    next();
};