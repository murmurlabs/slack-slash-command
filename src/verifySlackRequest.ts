import { createHmac } from "crypto";
import { Request, Response, NextFunction } from "express";

const SLACK_VERSION = "v0";
export const verifySlackRequest =
  (signingKey: string) => (req: Request, res: Response, next: NextFunction) => {
    const timestamp = req.headers["x-slack-request-timestamp"];
    const slackSignature = req.headers["x-slack-signature"];

    const signingMessage = `${SLACK_VERSION}:${timestamp}:${req.rawBody}`;

    const signature = `${SLACK_VERSION}=${createHmac("sha256", signingKey)
      .update(signingMessage)
      .digest("hex")}`;

    console.log(signature.toString(), slackSignature);

    if (signature.toString() === slackSignature) {
      return next();
    }

    return res.send("Invalid request signature");
  };
