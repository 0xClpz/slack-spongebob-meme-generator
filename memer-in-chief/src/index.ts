import "./env";
import serverless from "serverless-http";
import { init } from "@sentry/node";
import { imageWorker } from "./imageWorker";
import { app } from "./app";

if (process.env.SENTRY_DSN) {
  init({ dsn: process.env.SENTRY_DSN });
}

module.exports.handler = serverless(app);

module.exports.imageWorker = imageWorker;
