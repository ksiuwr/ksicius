import { ChatInputCommandInteraction, GuildMember, GuildMemberRoleManager } from 'discord.js';

import { EDIT_ROLE_ID } from '../config';
import { ConfigModel } from '../models/config';

/**
 * Function fetches welcome message and sends it to new guild member
 * @param interaction object which has all information about new member
 */
export const sendWelcomeMessage = async (member: GuildMember) => {
  const config = await ConfigModel.findOne();
  if (config) {
    member.send(config.WELCOME_MESSAGE as string);
  } else {
    member.send('Unable to find welcome message in config. Please contact discord bot dev at KSI');
  }
};

/**
 * Function to edit new welcome message
 * ====================================
 * 1. At first it checks if user has permission to edit welcome message by comparing
 * his list of roles to EDIT_ROLE_ID.
 *
 * 2. To add a newline in welcome message user has to
 * write manually \n in message and then bot will replace all those marks with real newlines.
 *
 * 3. At last message is updated in remote MongoDB instance and user is informed that
 * his changes were saved
 *
 * @param interaction object which has all information about used command and user
 */
export const editWelcomeMessage = async (interaction: ChatInputCommandInteraction) => {
  if (interaction.member?.roles) {
    const roleManager = interaction.member?.roles as GuildMemberRoleManager;
    let isAllowedToEdit = false;
    for (const role of roleManager.cache) {
      const roleId = role[0];
      if (roleId == EDIT_ROLE_ID) {
        isAllowedToEdit = true;
      }
    }
    if (isAllowedToEdit) {
      const parsedMessage = (interaction.options.data[0].value as string).replaceAll('\\n', '\n');
      await ConfigModel.findOneAndUpdate(
        {},
        {
          WELCOME_MESSAGE: parsedMessage
        }
      );
      interaction.reply({
        content: `New welcome message: \n${parsedMessage}`
      });
    }
  }
};
