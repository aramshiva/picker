const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

app.command("/picker", async ({ command, ack, client, body }) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: "modal",
        callback_id: "pick",
        title: {
          type: "plain_text",
          text: "Picker",
        },
        blocks: [
          {
            type: "input",
            block_id: "input",
            label: {
              type: "plain_text",
              text: "Reason",
            },
            element: {
              type: "plain_text_input",
              action_id: "reason_input",
              multiline: true,
            },
          },
        ],
        submit: {
          type: "plain_text",
          text: "Submit",
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
});

app.view("pick", async ({ ack, body, client }) => {
  await ack();

  const channel = "C0737AAH0H3";
  const values = body.view.state.values;
  const reason = values.input.reason_input.value;

  const response = await fetch(
    `https://slack.com/api/conversations.members?channel=${channel}&limit=100&pretty=1`,
    {
      headers: {
        Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );
  const members = JSON.parse(await response.text()).members;
  const picked = members[Math.floor(Math.random() * members.length)];

  try {
    await client.chat.postMessage({
      channel: channel,
      text: `<@${picked}> You have been picked for ${reason}`,
    });
  } catch (error) {
    console.log(error);
  }
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);

  console.log("⚡️ Bolt app is running!");
})();
