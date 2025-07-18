import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    let accessToken = req.headers.authorization;

    if (!accessToken) {
        throw new AppError("Não autorizado", 401);
    }

    const splitToken = accessToken.split(" ");

    jwt.verify(splitToken[1], 'SECRET_KEY', (error: any, decoded: any) => {
        if (error) {
            throw new AppError("Token de autorização inválido", 401);
        }

        res.locals.user_id = decoded.user_id;
    });
    next();
};
