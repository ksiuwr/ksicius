import { ChatInputCommandInteraction, GuildMemberRoleManager } from 'discord.js';

/**
 * Function to determine whether user is able to perform action based
 * on his roles at Discord
 * @param interaction object with all information about used command and user
 * @param requiredRole ID (Snowflake) of role we want to search for
 * @returns boolean if user is able to edit
 */
const isAbleToEdit = (interaction: ChatInputCommandInteraction, requiredRole: string) => {
  const roleManager = interaction.member?.roles as GuildMemberRoleManager;
  for (const role of roleManager.cache) {
    const roleId = role[0];
    if (roleId == requiredRole) {
      return true;
    }
  }
  return false;
};

export default isAbleToEdit;
