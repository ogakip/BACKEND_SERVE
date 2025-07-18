import { Request, Response } from "express";
import { ListAllUserService, LogUserService, RegUserService, UpdUserService } from "../service/users";

export const RegUserController = async (req: Request, res: Response) => {
    const service = await RegUserService(req.body);

    return res.status(201).json(service);
}

export const LogUserController = async (req: Request, res: Response) => {
    const service = await LogUserService(req.body);

    return res.status(200).json(service);
}

export const UpdUserController = async (req: Request, res: Response) => {
    const service = await UpdUserService(req.body)

    return res.status(200).json(service);
}

export const ListAllUserController = async (req: Request, res: Response) => {
    const service = await ListAllUserService();

    return res.status(200).json(service);
}