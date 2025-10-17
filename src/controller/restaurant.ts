import { Request, Response } from "express";
import {
  ClearCookieService,
  CreateRestaurantService,
  EditRestaurantService,
  LoginRestaurantService,
  LogoutRestaurantService,
  SetCookieService,
} from "../service/restaurant";

export const LogoutRestaurant = async (req: Request, res: Response) => {
  await LogoutRestaurantService(res.locals.restaurant_id);
  ClearCookieService(res);
  return res.status(204).send();
};

export const ValidateSession = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Sessão válida." });
};

export const CreateRestaurant = async (req: Request, res: Response) => {
  const service = await CreateRestaurantService(req.body);

  return res.status(201).json(service);
};

export const LoginRestaurant = async (req: Request, res: Response) => {
  const response = await LoginRestaurantService(req.body);
  ClearCookieService(res);
  SetCookieService(res, response.sessionToken);
  return res.status(200).send();
};

export const EditRestaurant = async (req: Request, res: Response) => {
  const service = await EditRestaurantService(
    res.locals.restaurant_id,
    req.body
  );

  return res.status(200).json(service);
};
