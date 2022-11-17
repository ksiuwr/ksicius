import {
  Client,
  Message,
  Snowflake,
  TextChannel,
  EmbedBuilder,
  roleMention
} from 'discord.js';
import config from '../config';

async function addReactions(message: Message) {
  if (message === null) return;
  for (const key of config.ROLES_MAP.keys()) {
    await message.react(key);
  }
}

export async function createManageRoleMessage(
  client: Client,
  channelId: Snowflake
): Promise<void> {
  const roles = config.ROLES_MAP;
  const channel = await client.channels.fetch(channelId);
  if (channel === null || !channel.isTextBased()) return;
  const textChannel = channel as TextChannel;

  const emojisFieldContent = Array.from(roles.keys()).join('\n\n');
  const rolesFieldContent = Array.from(roles.values())
    .map(roleId => roleMention(roleId)) // transform role ids into mentions
    .join('\n\n');

  const embed = new EmbedBuilder()
    .setTitle('Wybierz rolę')
    .addFields({
      name: 'Emoji',
      value: emojisFieldContent,
      inline: true
    })
    .addFields({
      name: 'Rola',
      value: rolesFieldContent,
      inline: true
    });

  const msg = await textChannel.send({ embeds: [embed] });
  if (msg === null) return;

  config.ROLES_MESSAGE_ID = msg.id;
  await addReactions(msg);
}
