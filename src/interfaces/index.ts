import { UnitTypeIngredients } from "../entities/ingredients";
import { OrderType } from "../entities/orders";
import { PlanRecurrence, PlanType } from "../entities/plans";

export interface CREATE_RESTAURANT_PROPS {
  fullname: string;
  email: string;
  username: string;
  password: string;
  phone: string;
  street: string;
  number: string;
  district: string;
  city: string;
  state: string;
  zip_code: string;
  branch_code?: string;
}

export interface LOGIN_RESTAURANT_PROPS {
  email?: string;
  username?: string;
  password: string;
  rememberMe?: boolean;
}

export interface EDIT_RESTAURANT_PROPS {
  fullname?: string;
  password?: string;
  phone?: string;
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

export interface LOGIN_ADMIN_PROPS {
  username: string;
  password: string;
}

export interface CREATE_ADMIN_PROPS {
  username: string;
  password: string;
}

export interface CREATE_PLAN_PROPS {
  title: string;
  description: string;
  price: number;
  type: PlanType;
  recurrence: PlanRecurrence;
  features: {
    maxEmployees: number;
    maxTables: number;
    num_licenses: number;
    maxHourlyOrders: number;
    maxIngredients: number;
    maxRecipes: number;
  };
  is_active: boolean;
}

export interface EDIT_PLAN_PROPS {
  title?: string;
  description?: string;
  price?: number;
  type?: PlanType;
  recurrence?: PlanRecurrence;
  features?: {
    maxEmployees: number;
    maxTables: number;
    num_licenses: number;
    maxHourlyOrders: number;
  };
  is_active?: boolean;
}

export interface CREATE_INGREDIENT_PROPS {
  title: string;
  description: string;
  unit_type: UnitTypeIngredients;
  unit_value: number;
}

export interface EDIT_INGREDIENT_PROPS {
  title?: string;
  desciprion?: string;
  unit_type?: UnitTypeIngredients;
  unit_value?: number;
}

export interface CREATE_RECIPE_PROPS {
  title: string;
  description: string;
  value: number;
  offer?: number;
}

export interface ADD_INGREDIENT_PROPS {
  quantity: number;
  recipe_id: number;
  ingredient_id: number;
}

export interface EDIT_RECIPE_PROPS {
  title?: string;
  description?: string;
  value?: number;
  offer?: number;
}

export interface CREATE_ORDER_PROPS {
  type?: OrderType;
}

export interface CREATE_DELIVERY_ORDER_DETAILS_PROPS {
  delivery_address: string;
  delivery_number: string;
  delivery_district: string;
  delivery_complement: string;
  client_name: string;
  client_phone: string;
  observations: string;
}

export interface CREATE_LOCAL_ORDER_DETAILS_PROPS {
  observations: string;
  client_name: string;
}