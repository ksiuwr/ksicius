import {
  Client,
  Events,
  GatewayIntentBits,
  Partials,
  TextChannel,
  REST,
  Routes
} from 'discord.js';
import { createManageRoleMessage } from './modules/roleReactionManager';
import {
  ROLES_CHANNEL_ID,
  AUTOROLE_ID,
  TOKEN,
  MONGO_LINK,
  CLIENT_ID,
  GUILD_ID,
  ROLES_MAP
} from './config';
import COMMANDS from './commands';
import { ConfigModel } from './models/config';
import mongoose from 'mongoose';

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
// await Config.create({ WELCOME_MESSAGE: 'abc' });
// console.log(await Config.find());

const rest = new REST({ version: '10' }).setToken(TOKEN);
await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
  body: COMMANDS.map(command => command.toJSON())
});
client.login(TOKEN);

client.once(Events.ClientReady, async () => {
  console.log('Ready');
  const roleChannel = await client.channels.fetch(ROLES_CHANNEL_ID);
  const textChannel = roleChannel as TextChannel;
  console.log(textChannel.lastMessage);
  console.log(textChannel.lastMessageId);
  if (!textChannel.lastMessageId) {
    createManageRoleMessage(client, ROLES_CHANNEL_ID);
  }
});

client.on(Events.MessageReactionAdd, async (messageReaction, user) => {
  if (user.bot) return;
  if (!messageReaction) return;
  messageReaction = await messageReaction.fetch();
  if (messageReaction.emoji.name === null) return;

  const message = await messageReaction.message.fetch();
  if (message.channelId != ROLES_CHANNEL_ID || message.guild === null) return;

  const roleId = ROLES_MAP.get(messageReaction.emoji.name);
  if (roleId === undefined) return;

  const guild = await message.guild.fetch();
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return;

  user = await user.fetch();
  guild.members.addRole({ role: role, user: user.id });
});

client.on(Events.MessageReactionRemove, async (messageReaction, user) => {
  if (user.bot) return;
  if (!messageReaction) return;
  messageReaction = await messageReaction.fetch();

  if (messageReaction.emoji.name === null) return;

  const message = await messageReaction.message.fetch();
  if (message.channelId != ROLES_CHANNEL_ID || message.guild === null) return;

  const roleId = ROLES_MAP.get(messageReaction.emoji.name);
  if (roleId === undefined) return;

  const guild = await message.guild.fetch();
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return;

  user = await user.fetch();
  guild.members.removeRole({ role: role, user: user.id });
});

client.on(Events.GuildMemberAdd, async member => {
  const config = await ConfigModel.findOne();
  if (config) {
    member.send(config.WELCOME_MESSAGE as string);
  } else {
    member.send(
      'Brak połączenia z bazą danych, przykro nam :(. Opisz błąd na kanale bota'
    );
  }

  const role = await member.guild.roles.fetch(AUTOROLE_ID);
  if (role === null) return;
  member.roles.add(role);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    switch (interaction.commandName) {
      case 'edit_welcome_message': {
        // dodac wstawianie zmiennych srodowiskowych
        const parsedMessage = (
          interaction.options.data[0].value as string
        ).replaceAll('\\n', '\n');
        await ConfigModel.findOneAndUpdate(
          {},
          {
            WELCOME_MESSAGE: parsedMessage
          }
        );
        interaction.reply({
          content: `New welcome message: \n${parsedMessage}`
        });
      }
    }
  }
});
