# Slack Slash Command Example

**This is intended for documentation purposes only. This repo is not supported beyond documentation.**

This is an example of how to setup a Slash command with HMAC verification.

First clone this repo:
```
git clone git@github.com:murmurlabs/slack-slash-command.git
```

Next, create a `.env` file. This is an environment variable file that will have your signing secret in it so that you can verify the Slack slash command.

## Create Slack App

Create a new Slack app at https://api.slack.com/apps/.

Under **Basic Information** you'll see a section called **App Credentials** and in that section, you'll see **Signing Secret**.

**Show** your signing secret and copy that value.

In this repo's `.env` file, paste the value, replacing `<SLACK_SIGNING_SECRET>` with the new value.

Now you're ready to get your app up and running.


## Running App

From within your cloned project, run `npm install`. This will install all of the dependencies you need for your Express app to run.

After `npm install` is complete, run `npm run dev`. 

Assuming you've set everything up correctly so far, you should see this in your terminal:

```
started at http://localhost:8000
```

Your app is now running at localhost:8000.

## Setup ngrok

Slack needs access to your local machine if you're testing this, so you need to have a tunnel to your local machine.

You can do this with [ngrok](https://ngrok.com).

Once you've created an account at ngrok and logged in, you should be prompted to install `ngrok` locally.

I do this with `brew install ngrok` (assuming you're running Homebrew on Mac).

Once you've installed `ngrok` and are logged into `ngrok` via your terminal, you need to run `ngrok`.

At its most basic, you need to run:

```sh
ngrok http --region=us 8000
```

This sets up an http ngrok tunnel in the us region that points to your localhost at port 8000.

You can test this by using the value that shows up in "Forwarding":

```
Forwarding                    https://231e0659ed96.ngrok.app -> http://localhost:8000
```

You should see this when you visit your tunnel root in your browser:

```
Welcome to Express & TypeScript Server
```

Now you're all set locally, it's time to setup your Slack slash command!

## Setup Slack Slash Command

- Once you have an app, go to "Slash Commands" in the sidebar. It should take you to a URL that looks like this: https://api.slack.com/apps/<YOUR APP ID>/slash-commands?

On the slash commands page, click "Create New Command".

Your command can be anything you want it to be, but remember to make it unique. There are some Slack slash commands that already exist (like "Feedback").

In **Request URL**, you want to add your ngrok tunnel hostname followed by "/slash-command" (if you're using this as a tutorial, it's the Express POST endpoint defined in `src/index.ts`).

In the example so far, my hostname is `https://231e0659ed96.ngrok.app`, so I would use the value `https://231e0659ed96.ngrok.app/slash-command` in **Request URL**.

You can choose what to add in **Short Description** and **Usage Hints**. 

## Run a Slash command

Now that you've set it up, you need to install the app into your Slack workspace to test it.

Once it's installed, you should be able to type `/your-command` replacing `your-command` with the command you chose from any channel in your workspace.

It will respond with: `Slash command received!` in Slack.

## Successful Command Request

The body will have the following shape:

```ts
type SlashCommandBody = {
  token: string,
  team_id: string,
  team_domain: string,
  channel_id: string,
  channel_name: string,
  user_id: string,
  user_name: string,
  command: string,
  text: string,
  api_app_id: string,
  is_enterprise_install: boolean, 
  response_url: string,
  trigger_id: string
}
```

Now you can handle the slash command as needed.

In the example, we get what we call the "subcommand" from text and the rest of text is sent to the command handler.

As an example, `help` would return a list of what you can do, `reports` would open a modal of existing reports, `channels` would list the channels the Slack app is in.