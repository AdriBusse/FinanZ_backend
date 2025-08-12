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
  entities: process.env.prod ? ["./dist/entity/*.*"] : ["./src/entity/*.*"],
  migrations: process.env.prod
    ? ["./dist/migrations/*.*"]
    : ["src/migrations/*.*"],
  seeds: process.env.prod ? ["src/seeds/*.*"] : ["src/seeds/*.*"],
};
