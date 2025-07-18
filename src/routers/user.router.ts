import { Router } from "express";

import { RegUserController, LogUserController, UpdUserController, ListAllUserController } from "../controller/users";
import { verifyToken } from "../middlewares/auth";

export const UserRouter = Router();
UserRouter.post("/login", LogUserController);
UserRouter.post(
  "/register",
  // verifyToken,
  RegUserController
);
UserRouter.patch("/change", verifyToken, UpdUserController)
UserRouter.get("/get", verifyToken, ListAllUserController)