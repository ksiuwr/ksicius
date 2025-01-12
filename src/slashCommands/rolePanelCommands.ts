import { SlashCommandBuilder } from 'discord.js';

import { addNewRoleWithReaction, deleteRoleWithReaction } from '../modules/roleReactionManager';
import { SlashCommand } from '../types';

const commands: SlashCommand[] = [
	{
		command: new SlashCommandBuilder()
			.setName('add_new_role_and_reaction')
			.setDescription('Add new role with reaction to role panel')
			.addStringOption(option =>
				option.setName('role_id').setDescription('New role ID').setRequired(true)
			)
			.addStringOption(option =>
				option.setName('reaction').setDescription('Reaction associated with role').setRequired(true)
			),
		execute: async interaction => {
			if (interaction.isChatInputCommand()) await addNewRoleWithReaction(interaction);
		}
	},
	{
		command: new SlashCommandBuilder()
			.setName('delete_role_with_reaction')
			.setDescription('Remove role from role panel')
			.addStringOption(option =>
				option.setName('role_id').setDescription('Role ID to delete').setRequired(true)
			)
			.addStringOption(option =>
				option.setName('emoji').setDescription("Role's emoji to delete").setRequired(true)
			),
		execute: async interaction => {
			if (interaction.isChatInputCommand()) await deleteRoleWithReaction(interaction);
		}
	}
];

export default commands;
