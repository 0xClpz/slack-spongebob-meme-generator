import { generateSpongebobMeme } from "./helpers/memeHelpers";
import axios from "axios";
import FormData from "form-data";
import { imageWorkerPayload } from "./types/sharedTypes";
import toStream from "buffer-to-stream";
import { searchSlackTeam } from "./database/SlackTeam";

export const imageWorker = async (event: imageWorkerPayload) => {
  const { text, channel_id, team_id } = event;
  const { text: processedText, buffer } = await generateSpongebobMeme(text);

  const team = await searchSlackTeam(team_id);

  const form = new FormData();
  form.append("token", team.bot.bot_access_token);
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
