import { ChatInputCommandInteraction, GuildMember } from 'discord.js';

import { EDIT_ROLE_ID } from '../config.js';
import { ConfigModel } from '../models/config.js';
import isAbleToEdit from '../utils/isAbleToEdit.js';

/**
 * Function which fetches welcome message and sends it to new guild member
 * @param interaction object with all information about used command and user
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
 * his list of roles to EDIT_ROLE_ID in isAbleToEdit function
 *
 * 2. To add a newline in welcome message user has to
 * write manually \n in message and then bot will replace all those marks with real newlines.
 *
 * 3. At last message is updated in remote MongoDB instance and user is informed that
 * his changes were saved
 *
 * @param interaction object with all information about used command and user
 */
export const editWelcomeMessage = async (interaction: ChatInputCommandInteraction) => {
  if (isAbleToEdit(interaction, EDIT_ROLE_ID)) {
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
};
