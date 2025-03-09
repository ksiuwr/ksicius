import {
	ChatInputCommandInteraction,
	DiscordAPIError,
	PollLayoutType,
	TextChannel
} from 'discord.js';

import { zip } from '../utils/array';

const hearts = ['❤️', '💚', '💙', '🧡', '💜', '🩷', '💛', '🤍', '🖤'];
const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export const createPoll = async (interaction: ChatInputCommandInteraction) => {
	const title = interaction.options.getString('title') ?? 'Poll';
	const optionsString = interaction.options.getString('options') ?? 'Option 1;Option 2;Option 3';
	const duration = interaction.options.getNumber('duration') ?? 12;
	const allowMultiselect = interaction.options.getBoolean('allow_multiselect') ?? true;
	const useNumbers = interaction.options.getBoolean('use_numbers') ?? false;

	const optionsList = optionsString.split(';').filter(opt => opt && opt.trim().length > 0);

	const channel = interaction.channel;
	if (channel === null || !(channel instanceof TextChannel)) {
		return;
	}

	if (optionsList.length === 0) {
		await interaction.reply({ content: 'Cannot create poll with empty options', ephemeral: true });
		return;
	}

	try {
		await channel.send({
			poll: {
				allowMultiselect: allowMultiselect,
				question: {
					text: title
				},
				answers: zip(optionsList, useNumbers ? numbers : hearts).map(element => {
					return {
						text: element.first,
						emoji: element.second
					};
				}),
				duration: duration,
				layoutType: PollLayoutType.Default
			}
		});
		await interaction.reply({ content: 'Poll created', ephemeral: true });
	} catch (err) {
		if (err instanceof DiscordAPIError) {
			interaction.reply({
				content: `Unable to create a poll: ${err.message}. Code: ${err.code}`
			});
		}
	}
};
