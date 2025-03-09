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
			option.setName('options').setDescription('List separated by ";"').setRequired(true)
		)
		.addNumberOption(option =>
			option
				.setName('duration')
				.setDescription('Poll duration in hours. Must be whole number. 12 by default')
				.setMinValue(1)
				.setRequired(false)
		)
		.addBooleanOption(option =>
			option
				.setName('allow_multiselect')
				.setDescription('Allow multiselect. True by default')
				.setRequired(false)
		)
		.addBooleanOption(option =>
			option
				.setName('use_numbers')
				.setDescription('Use old boring ass number emojis instead of hearts. False by default')
				.setRequired(false)
		),
	execute: async interaction => {
		if (interaction.isChatInputCommand()) await createPoll(interaction);
	}
};

export default command;
