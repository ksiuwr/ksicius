import { SlashCommandBuilder } from 'discord.js';

import { createPoll } from '../modules/createPoll';
import { SlashCommand } from '../types';

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName('create_poll')
    .setDescription('Generate poll with given list of options')
    .addStringOption(option =>
      option.setName('title').setDescription('Poll title').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('responses_list').setDescription('List separated by ";"').setRequired(true)
    ),
  execute: async interaction => {
    if (interaction.isChatInputCommand()) await createPoll(interaction);
  }
};

export default command;
