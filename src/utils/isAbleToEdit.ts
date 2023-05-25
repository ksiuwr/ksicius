import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

/**
 * Function to determine whether user is able to perform action if admin
 * @param interaction object with all information about used command and user
 * @returns boolean if user is able to edit
 */
const isAbleToEdit = (interaction: ChatInputCommandInteraction) => {
  const member = interaction.member as GuildMember;
  return member.permissions.has('Administrator');
};

export default isAbleToEdit;
