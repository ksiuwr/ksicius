import {
  APIEmbedField,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Guild,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Role,
  Snowflake,
  TextChannel,
  User,
  roleMention
} from 'discord.js';

import { ROLES_CHANNEL_ID } from '../config.js';
import { ConfigModel } from '../models/config.js';
import isAbleToEdit from '../utils/isAbleToEdit.js';

/**
 * Function to handle interaction with new role and reaction
 * 1. Function checks if user has proper permissions to add new role.
 * 2. Config in MongoDB instance is updated with new role.
 * 3. RoleMessage is updated, it's ID is also stored in config in MongoDB.
 * 4. User is informed if his operation was successful and after 10s feedback is deleted.
 * @param client Discord bot client
 * @param interaction object with all information about used command and user
 * @returns interaction reply
 */
export const addNewRoleWithReaction = async (
  client: Client,
  interaction: ChatInputCommandInteraction
) => {
  setTimeout(() => interaction.deleteReply(), 10000);
  if (!isAbleToEdit(interaction)) {
    return interaction.reply({
      content: "You don't have permission to add new role with reaction"
    });
  }

  const newRoleName = interaction.options.data[0].value as string;
  const newRoleEmoji = interaction.options.data[1].value as string;
  const config = await ConfigModel.findOneAndUpdate(
    {},
    {
      $set: {
        [`ROLE_TO_REACTION.${newRoleEmoji}`]: newRoleName
      }
    }
  );

  if (!config || !config.ROLE_TO_REACTION || !config.ROLE_TO_REACTION_MESSAGE_ID) {
    return interaction.reply({
      content: 'Unable to read config from MongoDB'
    });
  }
  const channel = await client.channels.fetch(ROLES_CHANNEL_ID);
  if (!channel) {
    return interaction.reply({
      content: 'Unable to fetch roles channel from Discord'
    });
  }
  const textChannel = channel as TextChannel;

  const manageRoleMessage = await textChannel.messages.fetch(config.ROLE_TO_REACTION_MESSAGE_ID);
  if (!manageRoleMessage) {
    return interaction.reply({
      content: 'Unable to fetch menage role message from Discord channel'
    });
  }
  const embed = await createRoleReactionEmbed();
  if (!embed) {
    return interaction.reply({
      content: 'Unable to fetch data from Discord'
    });
  }

  await manageRoleMessage.edit({ embeds: [embed] });

  return Promise.all([
    interaction.reply({
      content: 'Succesfully updated'
    }),
    addReactions(manageRoleMessage)
  ]);
};

/**
 * Function to detect whether there is a need to resend role message
 * If there isn't any message before at role channel then message is resent
 * @param client Discord bot client
 */

export const setupRoleMessage = async (client: Client) => {
  const roleChannel = await client.channels.fetch(ROLES_CHANNEL_ID);
  const textChannel = roleChannel as TextChannel;
  if (!textChannel.lastMessageId) {
    createManageRoleMessage(client, ROLES_CHANNEL_ID);
  }
};

export const createManageRoleMessage = async (
  client: Client,
  channelId: Snowflake
): Promise<void> => {
  const channel = await client.channels.fetch(channelId);
  if (channel === null || !channel.isTextBased()) return;
  const textChannel = channel as TextChannel;

  const embed = await createRoleReactionEmbed();
  if (embed) {
    const msg = await textChannel.send({ embeds: [embed] });
    if (msg === null) return;
    await ConfigModel.findOneAndUpdate({}, { ROLE_TO_REACTION_MESSAGE_ID: msg.id });
    await addReactions(msg);
  }
};

/** Function to create embed message for choosing a role at server
 * Is simply fetches data from MongoDB instance with role to reaction map
 * and then based on results renders embed with reactions
 * @returns embed message with roles and reactions
 */
const createRoleReactionEmbed = async () => {
  const config = await ConfigModel.findOne({});
  if (!config || !config.ROLE_TO_REACTION) return;
  if (config.ROLE_TO_REACTION.size == 0) {
    return new EmbedBuilder().setTitle('Hej! Wybierz swoje role').setColor('Gold');
  }
  const emojisFieldContent = Array.from(config.ROLE_TO_REACTION.keys()).join('\n\n');
  const rolesFieldContent = Array.from(config.ROLE_TO_REACTION.values())
    .map(roleId => roleMention(roleId))
    .join('\n\n');

  const fieldTab: APIEmbedField[] = [
    {
      name: 'Emoji',
      value: emojisFieldContent,
      inline: true
    },
    {
      name: 'Rola',
      value: rolesFieldContent,
      inline: true
    }
  ];

  const embed = new EmbedBuilder()
    .setTitle('Hej! Wybierz swoje role')
    .addFields(fieldTab)
    .setColor('Gold');

  return embed;
};

const addReactions = async (message: Message) => {
  if (message === null) return;
  const config = await ConfigModel.findOne({});
  if (!config || !config.ROLE_TO_REACTION) return;

  for (const key of config.ROLE_TO_REACTION.keys()) {
    await message.react(key);
  }
};

/** Function get guild, user id and role from message reaction
 * Function:
 * 1. Checks if user is not a bot
 * 2. Loads roles map and roles message id from MongoDB
 * 3. Checks if emoji is known and if message is roles message
 * 4. Tries to get role id
 * 5. Gets guild and role object
 * 6. Returns data
 * If any of these steps fails returns null
 * @param messageReaction Message reaction object
 * @param user User who added reaction
 * @returns tuple with guild object, user id and role object or null on failure
 */
const getGuildUserIdAndRole = async (
  messageReaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
): Promise<[Guild, Snowflake, Role] | null> => {
  if (user.bot) return null;

  const config = await ConfigModel.findOne({});
  if (!config || !config.ROLE_TO_REACTION || !config.ROLE_TO_REACTION_MESSAGE_ID) return null;

  messageReaction = await messageReaction.fetch();
  if (messageReaction.emoji.name === null) return null;
  if (messageReaction.message.id !== config.ROLE_TO_REACTION_MESSAGE_ID) return null;

  const roleId = config.ROLE_TO_REACTION.get(messageReaction.emoji.name);
  if (roleId === undefined) return null;

  const message = await messageReaction.message.fetch();
  if (message.guild === null) return null;

  const guild = await message.guild.fetch();
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return null;
  user = await user.fetch();

  return [guild, user.id, role];
};

/** Adds role from reaction added to roles message
 * @param messageReaction Message reaction object
 * @param user User who added reaction
 */
export const addRoleOnReactionAdded = async (
  messageReaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const result = await getGuildUserIdAndRole(messageReaction, user);
  if (result === null) return;
  const [guild, userId, role] = result;
  guild.members.addRole({ user: userId, role: role });
};

/** Removes role from reaction removed to roles message
 * @param messageReaction Message reaction object
 * @param user User who removed reaction
 */
export const removeRoleOnReactionRemoved = async (
  messageReaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  const result = await getGuildUserIdAndRole(messageReaction, user);
  if (result === null) return;
  const [guild, userId, role] = result;
  guild.members.removeRole({ user: userId, role: role });
};
