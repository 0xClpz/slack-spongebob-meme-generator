import fs from "fs";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

[".env.local", ".env"].forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    dotenvExpand(
      dotenv.config({
        path: dotenvFile
      })
    );
  }
});
