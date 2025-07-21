import 'reflect-metadata';
import { DataSource, Table } from 'typeorm';
import { Restaurant } from '../entities/restaurants';
import { Ingredients } from '../entities/ingredients';
import { Licenses } from '../entities/licenses';
import { Order } from 'mercadopago';
import { Plans } from '../entities/plans';
import { Recipe } from '../entities/recipe';
import { RecipeIngredient } from '../entities/recipeIngredients';
import { Subscriptions } from '../entities/subscriptions';
import { Admins } from '../entities/admin';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'serve_db_test',
  synchronize: true, // ⛔ troque pra false em produção!
  logging: false,
  entities: [Restaurant, Ingredients, Licenses, Order, Plans, Recipe, RecipeIngredient, Subscriptions, Table, Admins],
  migrations: [],
  subscribers: [],
});
