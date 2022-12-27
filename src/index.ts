import { Client, Events, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';

import COMMANDS from './commands';
import { CLIENT_ID, GUILD_ID, MONGO_LINK, TOKEN } from './config';
import {
  addNewRoleWithReaction,
  addReactionListeners,
  setupRoleMessage
} from './modules/roleReactionManager';
import { setupAutorole } from './modules/setupAutorole';
import { editWelcomeMessage, sendWelcomeMessage } from './modules/welcomeMessage';

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

await mongoose.connect(MONGO_LINK);

const rest = new REST({ version: '10' }).setToken(TOKEN);
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
  body: COMMANDS.map(command => command.toJSON())
});
await client.login(TOKEN);


client.on(Events.ClientReady, async () => {
  console.log('Ready');
  setupRoleMessage(client);
});

client.on(Events.MessageReactionAdd, async (messageReaction, user) => {
  if (user.bot) return;
  const roleId = await getRoleIdFromReaction(messageReaction);
  if (roleId === null) return;
  const guild = await messageReaction.message.guild?.fetch();
  if (guild === undefined) return;
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return;
  user = await user.fetch();
  guild.members.addRole({ role: role, user: user.id });
});

client.on(Events.MessageReactionRemove, async (messageReaction, user) => {
  if (user.bot) return;
  const roleId = await getRoleIdFromReaction(messageReaction);
  if (roleId === null) return;
  const guild = await messageReaction.message.guild?.fetch();
  if (guild === undefined) return;
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return;
  user = await user.fetch();
  guild.members.removeRole({ role: role, user: user.id });
});

client.on(Events.GuildMemberAdd, async member => {
  setupAutorole(member);
  sendWelcomeMessage(member);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case 'edit_welcome_message':
        editWelcomeMessage(interaction);
        break;
      case 'add_new_role_and_reaction':
        addNewRoleWithReaction(client, interaction);
        break;
    }
  }
});
