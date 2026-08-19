import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { ENTITIES } from "./database.module";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER || "admin",
  password: process.env.DB_PASSWORD || "admin123",
  database: process.env.DB_DATABASE || "finanz",
  entities: ENTITIES,
  migrations: ["src/migrations/*{.ts,.js}"],
  synchronize: false,
  logging: true,
});

export default AppDataSource;
