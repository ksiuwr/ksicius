import { SlashCommandBuilder } from 'discord.js';

const COMMANDS = [
  new SlashCommandBuilder()
    .setName('edit_welcome_message')
    .setDescription('Edit welcome message for new members')
    .addStringOption(option =>
      option.setName('new_message').setDescription('New message body').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('add_new_role_and_reaction')
    .setDescription('Add new role with reaction to role panel')
    .addStringOption(option =>
      option.setName('role_name').setDescription('New role name').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reaction').setDescription('Reaction associated with role').setRequired(true)
    )
];

export default COMMANDS;
