import { SlashCommandBuilder } from 'discord.js';

import { editWelcomeMessage } from '../modules/welcomeMessage';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('edit_welcome_message')
    .setDescription('Edit welcome message for new members')
    .addStringOption(option =>
      option.setName('new_message').setDescription('New message body').setRequired(true)
    ),
  execute: async interaction => {
    if (interaction.isChatInputCommand()) await editWelcomeMessage(interaction);
  }
};

export default command;
