import { GuildMember } from 'discord.js';

import { AUTOROLE_ID } from '../config';

/**
 * Function to setup new guild member autorole
 * @param interaction object which has all information about new member
 */
export const setupAutorole = async (member: GuildMember) => {
  const role = await member.guild.roles.fetch(AUTOROLE_ID);
  if (role === null) return;
  member.roles.add(role);
};
