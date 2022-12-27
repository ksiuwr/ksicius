import {
  APIEmbedField,
  ChatInputCommandInteraction,
  Client,
  EmbedBuilder,
  Message,
  MessageReaction,
  PartialMessageReaction,
  PartialUser,
  Snowflake,
  TextChannel,
  EmbedBuilder,
  roleMention,
  APIEmbedField,
  Snowflake,
  MessageReaction,
  PartialMessageReaction
} from 'discord.js';
import { ROLES_CHANNEL_ID, ROLES_MAP } from '../config';
import { EDIT_ROLE_ID, ROLES_CHANNEL_ID, ROLES_MAP } from '../config';
import { ConfigModel } from '../models/config';
import isAbleToEdit from '../utils/isAbleToEdit';

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
  if (!isAbleToEdit(interaction, EDIT_ROLE_ID)) {
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
  await addReactions(manageRoleMessage);
  return interaction.reply({
    content: 'Succesfully updated'
  });
};

export const getRoleIdFromReaction = async (
  messageReaction: MessageReaction | PartialMessageReaction
): Promise<Snowflake | null> => {
  if (!messageReaction) return null;
  messageReaction = await messageReaction.fetch();
  if (messageReaction.emoji.name === null) return null;

  const message = await messageReaction.message.fetch();
  if (message.channelId != ROLES_CHANNEL_ID || message.guild === null)
    return null;

  const roleId = ROLES_MAP.get(messageReaction.emoji.name);
  return roleId ?? null;
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

export const addReactionListeners = async (
  reaction: MessageReaction | PartialMessageReaction,
  user: User | PartialUser
) => {
  reaction = await reaction.fetch();
  if (reaction.emoji.name === null) return;

  const message = await reaction.message.fetch();
  if (message.channelId != ROLES_CHANNEL_ID || message.guild === null) return;

  const roleId = ROLES_MAP.get(reaction.emoji.name);
  if (roleId === undefined) return;

  const guild = await message.guild.fetch();
  const role = (await guild.roles.fetch()).get(roleId);
  if (role === undefined) return;

  user = await user.fetch();
  guild.members.addRole({ role: role, user: user.id });
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
