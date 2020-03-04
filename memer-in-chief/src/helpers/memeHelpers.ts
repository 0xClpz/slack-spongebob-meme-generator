import Jimp from "jimp";
import * as path from "path";

function tweak(character: string) {
  return Math.random() < 0.5
    ? character.toLowerCase()
    : character.toUpperCase();
}

export async function generateSpongebobMeme(userInput: string) {
  const image = await Jimp.read(path.resolve(__dirname, '../assets/meme.jpg'));
  const font = await Jimp.loadFont(Jimp.FONT_SANS_32_WHITE);
  const blackFont = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

  const text = userInput
    .replace(/\W/g, '')
    .split("")
    .map(tweak)
    .join("");

  image.print(
    blackFont,
    9,
    9,
    {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
    },
    image.getWidth() - 10
  );

  image.print(
    blackFont,
    11,
    11,
    {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
    },
    image.getWidth() - 10
  );

  image.print(
    font,
    10,
    10,
    {
      text,
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER
    },
    image.getWidth() - 10
  );

  return {
    buffer: image.getBufferAsync(Jimp.MIME_JPEG),
    text
  };
}
