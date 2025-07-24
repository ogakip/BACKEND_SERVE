import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Restaurant } from '../entities/restaurants';
import { Restaurant_Ingredients } from '../entities/ingredients';
import { Subscriptions_Licenses } from '../entities/licenses';
import { Plans } from '../entities/plans';
import { Restaurant_Recipe } from '../entities/recipe';
import { Recipe_Ingredients } from '../entities/recipeIngredients';
import { Restaurant_Subscriptions } from '../entities/subscriptions';
import { Admins } from '../entities/admin';
import { Restaurant_Order  } from '../entities/orders';
import { Restaurant_Tables } from '../entities/tables';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'serve_db_test',
  synchronize: true, // ⛔ troque pra false em produção!
  logging: false,
  entities: [Restaurant, Restaurant_Ingredients, Subscriptions_Licenses, Restaurant_Order , Plans, Restaurant_Recipe, Recipe_Ingredients, Restaurant_Subscriptions, Restaurant_Tables, Admins],
  migrations: [],
  subscribers: [],
});
