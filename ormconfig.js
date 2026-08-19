const isProd =
  process.env.prod === "true" ||
  process.env.prod === "1" ||
  process.env.NODE_ENV === "production";

module.exports = {
  name: "default",
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: isProd ? ["./dist/src/entity/*.*"] : ["./src/entity/*.*"],
  migrations: isProd
    ? ["./dist/src/migrations/*.*"]
    : ["src/migrations/*.*"],
  seeds: isProd ? ["src/seeds/*.*"] : ["src/seeds/*.*"],
};
