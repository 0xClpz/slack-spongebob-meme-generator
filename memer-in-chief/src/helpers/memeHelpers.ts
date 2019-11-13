import { createCanvas, loadImage } from "canvas";
import path from "path";

function tweak(character: string) {
  return Math.random() < 0.5
    ? character.toLowerCase()
    : character.toUpperCase();
}
export const generateSpongebobMeme = async (phrase: string) => {
  const image = await loadImage(path.join(__dirname, "..", "assets", "meme.jpg"));

  const canvas = createCanvas(583, 411);

  const ctx = canvas.getContext("2d");


  let fontSize = 42;


  let width = 583;
  let height = 411;
  let center = width / 2;
  let lineWidth = 2.5;

  ctx.fillStyle = "#FFF";
  ctx.strokeStyle = "#000";
  ctx.textAlign = "center";

  ctx.drawImage(image, 0, 0);
  ctx.font = fontSize + "px Arial";
  ctx.lineWidth = lineWidth;
  const text = phrase.split("").map(tweak).join("");
  let m = text.match(/([^\n]+(?:\n[^\n]+)*)?(\n(?:\n[^\n]+)*)?/);
  // @ts-ignore
  let top = m[1] ? m[1] : "";
  // @ts-ignore
  let bottom = m[2] ? m[2] : "";
  top.split("\n").map(function (line, lineno) {
    // top margin + number of lines * char height incl. padding
    var yoffset = 5 + ((1 + lineno) * (fontSize * 1.1));
    ctx.fillText(line, center, yoffset, width - 10);
    ctx.strokeText(line, center, yoffset, width - 10);
  });
  bottom.split("\n").reverse().map(function (line, lineno) {
    var yoffset = height - 10 - (lineno * (fontSize * 1.1));
    ctx.fillText(line, center, yoffset, width - 10);
    ctx.strokeText(line, center, yoffset, width - 10);
  });

  return {
    stream: canvas.createPNGStream(),
    text
  }
};
