import { Router } from "express";
import { CreateAadmin, CreatePlan, LoginAdmin } from "../controller/admin";
import { verifyAdminToken } from "../middlewares/auth";

export const AdminRoutes = Router()

AdminRoutes.post('/register', CreateAadmin)
AdminRoutes.post('/login', LoginAdmin);
AdminRoutes.post('/plan', verifyAdminToken,CreatePlan);