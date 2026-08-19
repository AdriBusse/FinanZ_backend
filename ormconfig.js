const isTsNode = Boolean(
  process[Symbol.for("ts-node.register.instance")] ||
  process.env.TS_NODE_DEV
);

const isProd =
  !isTsNode ||
  process.env.prod === "true" ||
  process.env.prod === "1" ||
  process.env.NODE_ENV === "production";

module.exports = {
  name: "default",
  type: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  synchronize: true,
  logging: true,
  entities: isProd ? ["./dist/src/entity/*.js", "./dist/src/entity/*.*"] : ["./src/entity/*.*"],
  migrations: isProd
    ? ["./dist/src/migrations/*.js", "./dist/src/migrations/*.*"]
    : ["src/migrations/*.*"],
  seeds: isProd ? ["./dist/src/seeds/*.js", "src/seeds/*.*"] : ["src/seeds/*.*"],
};
