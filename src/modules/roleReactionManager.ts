import {
  Client,
  Message,
  TextChannel,
  EmbedBuilder,
  roleMention,
  Events
} from 'discord.js';
import { ROLES_MAP, ROLES_CHANNEL_ID } from '../config';

async function addReactions(message: Message) {
  if (message === null) return;
  for (const key of ROLES_MAP.keys()) {
    await message.react(key);
  }
}

export function addReactionListeners(client: Client) {
  client.on(Events.MessageReactionAdd, async (reaction, user) => {
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
  });
}

export async function createManageRoleMessage(client: Client): Promise<void> {
  const channel = await client.channels.fetch(ROLES_CHANNEL_ID);
  if (channel === null || !channel.isTextBased()) return;
  const textChannel = channel as TextChannel;

  const emojisFieldContent = Array.from(ROLES_MAP.keys()).join('\n\n');
  const rolesFieldContent = Array.from(ROLES_MAP.values())
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

  await addReactions(msg);
}
