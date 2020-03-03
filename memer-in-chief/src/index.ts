import "./env";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import FormData from "form-data";
import serverless from "serverless-http";
import { init, Handlers } from "@sentry/node";
// @ts-ignore
import toStream from "buffer-to-stream";
import { generateSpongebobMeme } from "./helpers/memeHelpers";

export const app = express();

if (process.env.SENTRY_DSN) {
  init({ dsn: process.env.SENTRY_DSN });
}

app.use(Handlers.requestHandler());

app.post(
  "/slack/generate",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { text, channel_id } = req.body;
    const { text: processedText, buffer } = await generateSpongebobMeme(text);

    const form = new FormData();

    form.append("token", process.env.SLACK_TOKEN);
    form.append("title", processedText);
    form.append("filename", "image.jpg");
    form.append("filetype", "auto");
    form.append("channels", channel_id);
    form.append("file", toStream(await buffer), "image.jpg");

    await axios.post("https://slack.com/api/files.upload", form, {
      headers: form.getHeaders()
    });
    res.sendStatus(200);
  }
);

app.get("/data", (req, res) => {
  res.send(process.env.SLACK_TOKEN);
});

app.get("/ping", (req, res) => res.send("pong"));

app.use(Handlers.errorHandler());

module.exports.handler = serverless(app);
