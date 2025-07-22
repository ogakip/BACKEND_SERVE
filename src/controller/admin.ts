import { Request, Response } from "express";
import { CreateAdminService, CreatePlanService, EditPlanService, LoginAdminService } from "../service/admin";

export const CreateAadmin = async (req: Request, res: Response) => {
    const service = await CreateAdminService(req.body);

    return res.status(201).json(service);
}

export const LoginAdmin = async (req: Request, res: Response) => {
    const service = await LoginAdminService(req.body);

    return res.status(200).json(service);
}

export const CreatePlan = async (req: Request, res: Response) => {
    const service = await CreatePlanService(res.locals.admin_id, req.body);

    return res.status(201).json(service);
}

export const EditPlan = async (req: Request, res: Response) => {
    const { id } = req.params;

    const service = await EditPlanService(res.locals.admin_id, Number(id), req.body);

    return res.status(200).json(service);
}