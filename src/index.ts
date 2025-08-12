import "reflect-metadata";
import { createConnection } from "typeorm";
import Express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createSchema } from "./utils/createSchema";
import cors from "cors";
import cookieParser from "cookie-parser";
import user from "./modules/middleware/user";
import dotenv from "dotenv";
import aiService from "./services/ai.service";

dotenv.config({ path: __dirname + "/../.env" });

const start = async () => {
  console.log(process.env.DB_HOST)
  console.log(process.env.DB_PORT)
  console.log(process.env.DB_USER)
  console.log(process.env.DB_PASSWORD)
  console.log(process.env.DB_DATABASE)
  console.log(process.env.prod)
  try {
    await createConnection();
  } catch (error) {
    console.log(error);
  }

  const schema = await createSchema();

  const apolloServer = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    // Expose aiService on context for resolvers: ctx.ai
    context: ({ req, res }: any) => ({ req, res, ai: aiService }),
    introspection: true,
  });

  const app = Express();

  app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );
  app.use(Express.static(__dirname + "/../public"));

  app.use(cookieParser());
  app.use(user);

  app.get("/ping", (_, res) => {
    res.send("pong...");
  });

  await apolloServer
    .start()
    .then(() => console.log("GraphQL Server started"))
    .catch((err) => {
      console.error("ERROR:___" + err);
    });
  apolloServer.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: "*",
    },
  });

  app.listen(4000, () => {
    console.log("Server listen on port 4000");
  });
};
start();
