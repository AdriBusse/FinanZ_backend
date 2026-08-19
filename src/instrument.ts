
import dotenv from "dotenv";
import * as Sentry from "@sentry/node";

dotenv.config({ path: __dirname + "/../.env" });

const isProduction =
  process.env.prod === "true" ||
  process.env.prod === "1" ||
  process.env.NODE_ENV === "production";

const environment = isProduction ? "production" : "development";

// Ensure to call this before requiring any other modules!
Sentry.init({
  dsn: "http://34bac922ee8a4ab8b9ba6d347abe0e2c@glitchtip-owjhy2eb3n99n9wfoj6gscko.168.119.49.31.sslip.io/2",
  environment,
  tracesSampleRate: isProduction ? 0.2 : 1.0,
});
