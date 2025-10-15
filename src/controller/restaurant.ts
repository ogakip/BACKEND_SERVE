import { Request, Response } from "express";
import {
  ClearCookieService,
  CreateRestaurantService,
  EditRestaurantService,
  LoginRestaurantService,
  SetCookieService,
} from "../service/restaurant";

export const ValidateSession = async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Sessão válida." });
};

export const CreateRestaurant = async (req: Request, res: Response) => {
  const service = await CreateRestaurantService(req.body);

  return res.status(201).json(service);
};

export const LoginRestaurant = async (req: Request, res: Response) => {
  const service = await LoginRestaurantService(req.body);

  if (service.sessionToken) {
    SetCookieService(res, service.sessionToken);

    return res
      .status(201)
      .json({
        accessToken: service.accessToken,
        sessionToken: service.sessionToken,
      });
  } else {
    ClearCookieService(res);

    return res.status(201).json({ accessToken: service.accessToken });
  }
};

export const EditRestaurant = async (req: Request, res: Response) => {
  const service = await EditRestaurantService(
    res.locals.restaurant_id,
    req.body
  );

  return res.status(200).json(service);
};
