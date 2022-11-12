import {
  Client,
  EmojiIdentifierResolvable,
  Message,
  Snowflake,
  TextChannel,
  EmbedBuilder,
  roleMention
} from 'discord.js';

const rolesMap = new Map<
  Snowflake,
  Map<EmojiIdentifierResolvable, Snowflake>
>();
const messageIds = new Set<Snowflake>();

async function addReactions(message: Message) {
  if (message === null) return;
  const messageRoles = rolesMap.get(message.id);
  if (messageRoles === undefined) return;
  for (const key of messageRoles.keys()) {
    await message.react(key);
  }
}

export async function createManageRoleMessage(
  client: Client,
  channelId: Snowflake,
  roles: Map<EmojiIdentifierResolvable, Snowflake>
): Promise<void> {
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

  rolesMap.set(msg.id, roles);
  await addReactions(msg);

  messageIds.add(msg.id);
}
