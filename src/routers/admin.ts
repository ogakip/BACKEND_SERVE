import { Router } from "express";
import { CancelPlan, CreateAadmin, CreatePlan, EditPlan, LoginAdmin } from "../controller/admin";
import { verifyAdminToken } from "../middlewares/auth";

export const AdminRoutes = Router()

AdminRoutes.post('/register', CreateAadmin)
AdminRoutes.post('/login', LoginAdmin);
AdminRoutes.post('/plan', verifyAdminToken, CreatePlan);
AdminRoutes.patch('/plan/:id', verifyAdminToken, EditPlan)
AdminRoutes.patch('/plan/cancel/:id', verifyAdminToken, CancelPlan)