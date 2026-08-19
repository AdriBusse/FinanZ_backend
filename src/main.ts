import "./instrument";
import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import cookieParser from "cookie-parser";
import { graphqlUploadExpress } from "graphql-upload-minimal";
import express from "express";
import path from "path";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  app.enableCors({
    credentials: true,
    origin: "*",
  });

  // Enable multipart requests for GraphQL upload handling
  app.use(graphqlUploadExpress({ maxFileSize: 20 * 1024 * 1024, maxFiles: 1 }));

  // Static assets
  app.use(express.static(path.join(process.cwd(), "public")));

  app.use(cookieParser());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
}

bootstrap();
