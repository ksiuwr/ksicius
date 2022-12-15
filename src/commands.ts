import { SlashCommandBuilder } from 'discord.js';

const COMMANDS = [
  new SlashCommandBuilder()
    .setName('edit_welcome_message')
    .setDescription('Edit welcome message for new members')
    .addStringOption(option =>
      option.setName('new_message').setDescription('New message body').setRequired(true)
    )
];

export default COMMANDS;
