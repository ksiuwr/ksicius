import { Client, Snowflake, Events } from 'discord.js';
import { AUTOROLE_ID } from '../config';

export function setupAutorole(client: Client) {
  client.on(Events.GuildMemberAdd, async member => {
    const role = await member.guild.roles.fetch(AUTOROLE_ID);
    if (role === null) return;
    member.roles.add(role);
  });
}
