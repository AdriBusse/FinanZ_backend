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
    bodyParser: false,
  });

  app.enableCors({
    credentials: true,
    origin: "*",
  });

  // Increase payload limit to 50MB for JSON (base64 voice recordings) and URL-encoded bodies
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Enable multipart requests for GraphQL file uploads (50MB)
  app.use(graphqlUploadExpress({ maxFileSize: 50 * 1024 * 1024, maxFiles: 10 }));

  // Static assets
  app.use(express.static(path.join(process.cwd(), "public")));

  app.use(cookieParser());

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`Server listening on port ${port}`);
}

bootstrap();
