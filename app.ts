const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/pick", async ({ command, ack, client, body }: any) => {
  await ack();

  const channel = body.channel_id;
  const user = body.user_id;
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
        private_metadata: JSON.stringify({ channel, body }),
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

app.view("pick", async ({ ack, body, client }: any) => {
  await ack();

  const channel = JSON.parse(body.view.private_metadata)[0];
  const values = body.view.state.values;
  const reason = values.input.reason_input.value;
  const user = JSON.parse(body.view.private_metadata)[1];

  try {
    const result = await app.client.conversations.members({ channel });
    const members = result.members;

    const picked = members[Math.floor(Math.random() * members.length)];

    await client.chat.postMessage({
      channel: channel,
      text: `Hey <@${picked}>! You have been picked for ${reason} by <@${user}>`,
    });
  } catch (error) {
    console.error("Failed to pick a member:", error);
  }
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

// example response:
// {
//     "ok": true,
//     "members": [
//         "U01MPHKFZ7S",
//         "U043Q05KFAA",
//         "U04FATFRE6T",
//         "U05JX2BHANT",
//         "U05NX48GL3T",
//         "U05QJ4CF5QT",
//         "U0616280E6P",
//         "U06LWT5MHGQ",
//         "U07373D8R7X"
//     ],
//     "response_metadata": {
//         "next_cursor": ""
//     }
// }
