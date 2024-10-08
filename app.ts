const { App } = require("@slack/bolt");
require("dotenv").config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

app.command("/picker", async ({ command, ack, client, body }: any) => {
  await ack();

  const metadata_to_send = { channel: body.channel_id, user: body.user_id };
  const metadata = JSON.stringify(metadata_to_send);

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
        private_metadata: metadata,
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
  const metadata = JSON.parse(body.view.private_metadata);
  const channel = metadata["channel"];
  const user = metadata["user"];
  const values = body.view.state.values;
  const reason = values.input.reason_input.value;

  try {
    const result = await app.client.conversations.members({ channel });
    const members = result.members;

    let toremove = [];
    for (let member in members) {
      let m = members[member];
      try {
        const result = await client.users.info({
          user: m,
        });

        if (result.user.is_bot) {
          toremove.push(member);
        }
      } catch (error) {
        console.error(error);
      }
    }

    for (const remove in toremove) {
      members.pop(remove);
    }

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
