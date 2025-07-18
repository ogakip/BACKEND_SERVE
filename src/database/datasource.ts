import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from '../entities/users';
import { Table } from '../entities/tables';
import { Item } from '../entities/items';
import { StockIngredient } from '../entities/stockIngredients';
import { Recipe } from '../entities/recipes';
import { RecipeIngredient } from '../entities/recipeIngredients';
import { Order } from '../entities/order';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'S0m4v3@2k25',
  database: 'serve_db_test',
  synchronize: true, // ⛔ troque pra false em produção!
  logging: false,
  entities: [User, Table, Item, StockIngredient, Recipe, RecipeIngredient, Order],
  migrations: [],
  subscribers: [],
});
