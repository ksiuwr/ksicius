import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  TextChannel
} from 'discord.js';
import { createManageRoleMessage } from './modules/roleReactionManager';
import { ROLES_CHANNEL_ID, WELCOME_MESSAGE, AUTOROLE_ID } from './config';

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

client.once(Events.ClientReady, async () => {
  console.log('Ready');
  const roleChannel = await client.channels.fetch(ROLES_CHANNEL_ID);
  const textChannel = roleChannel as TextChannel;
  if (!textChannel.lastMessageId) {
    createManageRoleMessage(client, ROLES_CHANNEL_ID);
  }
});

client.login(token);

client.on(Events.MessageReactionAdd, (messageReaction, user) => {
  if (user.bot) return;
});

client.on(Events.GuildMemberAdd, async member => {
  const role = await member.guild.roles.fetch(AUTOROLE_ID);
  if (role === null) return;
  member.roles.add(role);
});

client.on(Events.GuildMemberAdd, user => {
  user.send(WELCOME_MESSAGE);
});
