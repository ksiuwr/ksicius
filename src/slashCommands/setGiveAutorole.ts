import { SlashCommandBuilder } from 'discord.js';

import { setAutoroleEnabled } from '../modules/setupAutorole';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('set_give_autorole')
    .setDescription('Enable or disable giving new members guest role')
    .addBooleanOption(option =>
      option.setName('enabled').setDescription('Should autorole be enabled').setRequired(true)
    ),
  execute: async interaction => {
    if (interaction.isChatInputCommand()) await setAutoroleEnabled(interaction);
  }
};

export default command;
