import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import { verifySlackRequest } from "./verifySlackRequest";
import bodyParser from "body-parser";

dotenv.config();

const app: Application = express();
const port = process.env.PORT || 8000;

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Express & TypeScript Server");
});

app.listen(port, () => {
  console.log(`started at http://localhost:${port}`);
});

if (!process.env.SLACK_SIGNING_SECRET) {
  console.error("SLACK_SIGNING_SECRET is required");
  process.exit(1);
}

const rawBodySaver = (
  req: Request,
  _: Response,
  buf: Buffer,
  encoding: BufferEncoding
) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || "utf8");
  }
};

app.use(bodyParser.urlencoded({ verify: rawBodySaver, extended: true }));
app.use(bodyParser.json({ verify: rawBodySaver }));
app.use(verifySlackRequest(process.env.SLACK_SIGNING_SECRET));

app.post("/slash-command", (req: Request, res: Response) => {
  const [subcommand, ...rawOptions] = req.body.text
    .split(" ")
    .map((part: string) => part.trim());

  switch (subcommand) {
    case "setup-user":
      // handle setup users in your database
      break;
    case "run":
      // call run pipeline
      break;
  }
  res.send("Slash command received!");
});
