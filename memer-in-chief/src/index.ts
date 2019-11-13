import './env'
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import FormData from "form-data";
import { generateSpongebobMeme } from "./helpers/memeHelpers";

const app = express();

app.post("/slack/generate", bodyParser.urlencoded({extended: false}), async (req, res) => {
  res.sendStatus(200);
  const { text, channel_id } = req.body;
  const {stream, text: processedText} = await generateSpongebobMeme(text);

  const form = new FormData()

  form.append("token", process.env.SLACK_TOKEN)
  form.append("title", processedText)
  form.append("filename", "image.png")
  form.append("filetype", "auto")
  form.append("channels", channel_id)
  form.append("file", stream, "image.png")

  await axios.post('https://slack.com/api/files.upload', form, {
    headers: form.getHeaders()
  })
});

app.listen(9000, () => {
  console.log(`🧽  Server up and running at port 9000 🧽`);
});
