import { Router } from "express";

import { RegUserController, LogUserController } from "../controller/users";
import { verifyToken } from "../middlewares/auth";

export const UserRouter = Router();
UserRouter.post("/login", LogUserController);
UserRouter.post(
  "/register",
  // verifyToken,
  RegUserController
);
