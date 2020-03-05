import { Handlers } from "@sentry/node";
import bodyParser from "body-parser";
import AWS from "aws-sdk";
import { imageWorkerPayload } from "./types/sharedTypes";
import express from "express";
import axios from "axios";
import { SlackOauthAccessPayload, SlackOauthResponse } from "./types/slack";
import querystring from "querystring";
import { createSlackTeam } from "./database/SlackTeam";

export const app = express();

app.use(Handlers.requestHandler());

app.get("/slack/authenticate", async (req, res) => {
  const { code } = req.query;

  const { client_id, client_secret, front_url } = process.env;
  if (!client_id || !client_secret) {
    throw new Error(
      "Missing required env variable, one of: client_id, client_secret_redirect_uri"
    );
  }

  const payload: SlackOauthAccessPayload = {
    client_id,
    client_secret,
    code
  };
  try {
    const { data } = await axios.post<SlackOauthResponse>(
      `https://slack.com/api/oauth.access`,
      querystring.stringify(payload)
    );

    if (typeof data?.ok !== "undefined" && !data?.ok) {
      throw data.error;
    }

    console.log(data);
    await createSlackTeam(data);

    res.redirect(`${front_url}/success`);
  } catch (e) {
    console.log(e);
    res.redirect(`${front_url}/error`);
  }
});

app.post(
  "/slack/generate",
  bodyParser.urlencoded({ extended: false }),
  async (req, res) => {
    const { text, channel_id, team_id } = req.body;
    const lambda = new AWS.Lambda({
      region: "us-east-1"
    });

    const payload: imageWorkerPayload = {
      text,
      channel_id,
      team_id
    };

    await lambda
      .invoke({
        FunctionName: "memer-in-chief-dev-image-worker",
        Payload: JSON.stringify(payload),
        InvocationType: "Event"
      })
      .promise();
    res.send({
      text: "Meme request r e c e i v e d 🧠"
    });
  }
);

app.use(Handlers.errorHandler());
