import "reflect-metadata";
import express from "express";
import "express-async-errors";
import cors from "cors";
import { handleAppErrorMiddleware } from "./middlewares/handleAppError";
import { UserRouter } from "./routers/user.router";

export const app = express();
app.use(express.json());
app.use(cors());
app.use("/user", UserRouter);
app.use(handleAppErrorMiddleware);