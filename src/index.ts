import { Client, Events, GatewayIntentBits, Partials, REST, Routes } from 'discord.js';
import mongoose from 'mongoose';

import COMMANDS from './commands';
import { CLIENT_ID, GUILD_ID, MONGO_LINK, TOKEN } from './config';
import { addReactionListeners, setupRoleMessage } from './modules/roleReactionManager';
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

client.on(Events.MessageReactionAdd, (messageReaction, user) => {
  addReactionListeners(messageReaction, user);

  if (user.bot) return;
  if (!messageReaction) return;
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
    }
  }
});
