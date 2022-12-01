import {
  Client,
  Message,
  TextChannel,
  EmbedBuilder,
  roleMention,
  APIEmbedField,
  Snowflake
} from 'discord.js';
import { ROLES_MAP } from '../config';

const addReactions = async (message: Message) => {
  if (message === null) return;
  for (const key of ROLES_MAP.keys()) {
    await message.react(key);
  }
};

export const createManageRoleMessage = async (
  client: Client,
  channelId: Snowflake
): Promise<void> => {
  const channel = await client.channels.fetch(channelId);
  if (channel === null || !channel.isTextBased()) return;
  const textChannel = channel as TextChannel;

  const emojisFieldContent = Array.from(ROLES_MAP.keys()).join('\n\n');
  const rolesFieldContent = Array.from(ROLES_MAP.values())
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

  const msg = await textChannel.send({ embeds: [embed] });
  if (msg === null) return;

  await addReactions(msg);
};
