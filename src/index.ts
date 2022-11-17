import { Client, Events, GatewayIntentBits, Partials } from 'discord.js';
import { createManageRoleMessage } from './modules/roleReactionManager';
import { IS_ROLES_MESSAGE_PRINTED, ROLES_CHANNEL_ID } from './config';
const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once(Events.ClientReady, () => {
  console.log('Ready');
  if (!IS_ROLES_MESSAGE_PRINTED) {
    createManageRoleMessage(client, ROLES_CHANNEL_ID);
  }
});

client.login(token);

client.on(Events.MessageReactionAdd, (messageReaction, user) => {
  if (user.bot) return;
});
