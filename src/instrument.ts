import * as Sentry from "@sentry/nestjs";
import { nodeProfilingIntegration } from "@sentry/profiling-node";
import dotenv from "dotenv";

dotenv.config({ path: __dirname + "/../.env" });

const isProduction =
  process.env.prod === "true" ||
  process.env.prod === "1" ||
  process.env.NODE_ENV === "production";

const environment = isProduction ? "production" : "development";

// Ensure Sentry is initialized before any application modules are loaded
Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    "http://34bac922ee8a4ab8b9ba6d347abe0e2c@glitchtip-owjhy2eb3n99n9wfoj6gscko.168.119.49.31.sslip.io/2",
  environment,
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: isProduction ? 0.2 : 1.0,
  profilesSampleRate: isProduction ? 0.2 : 1.0,
});
