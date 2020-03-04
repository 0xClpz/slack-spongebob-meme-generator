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
import AWS from "aws-sdk";

export const app = express();

if (process.env.SENTRY_DSN) {
  init({ dsn: process.env.SENTRY_DSN });
}

type imageWorkerPayload = {
  text: string;
  channel_id: string;
};

app.use(Handlers.requestHandler());

app.post(
  "/slack/generate",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { text, channel_id } = req.body;
    console.log(req.body)
    const lambda = new AWS.Lambda({
      region: "us-east-1"
    });
    const payload: imageWorkerPayload = {
      text,
      channel_id
    };

    await lambda
      .invoke({
        FunctionName: "memer-in-chief-dev-image-worker",
        Payload: JSON.stringify(payload),
        InvocationType: "Event"
      })
      .promise();
    res.send({
      text: 'Meme request r e c e i v e d 🧠'
    });
  }
);

app.get("/data", (req, res) => {
  res.send(process.env.SLACK_TOKEN);
});

app.get("/ping", (req, res) => res.send("pong"));

app.use(Handlers.errorHandler());

module.exports.handler = serverless(app);

module.exports.imageWorker = async (event: imageWorkerPayload) => {
  const { text, channel_id } = event;
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
  return "ok";
};
