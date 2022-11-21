import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  TextChannel
} from 'discord.js';
import { createManageRoleMessage, addReactionListeners } from './modules/roleReactionManager';
import { ROLES_CHANNEL_ID, WELCOME_MESSAGE } from './config';

const token = process.env.TOKEN;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.once(Events.ClientReady, async () => {
  console.log('Ready');
  const roleChannel = await client.channels.fetch(ROLES_CHANNEL_ID);
  const textChannel = roleChannel as TextChannel;
  if (!textChannel.lastMessageId) {
    createManageRoleMessage(client, ROLES_CHANNEL_ID);
  }
});

client.login(token);

addReactionListeners(client);

client.on(Events.MessageReactionAdd, (messageReaction, user) => {
  if (user.bot) return;
});

client.on(Events.GuildMemberAdd, user => {
  user.send(WELCOME_MESSAGE);
});
