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
      option.setName('role_id').setDescription('New role ID').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reaction').setDescription('Reaction associated with role').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('set_autorole')
    .setDescription('Enable or disable giving new members guest role')
    .addBooleanOption(option =>
      option.setName('enabled').setDescription('Should autorole be enabled').setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName('create_poll')
    .setDescription('Generate poll with given list of options')
    .addStringOption(option =>
      option.setName('title').setDescription('Poll title').setRequired(true)
    )
    .addStringOption(option =>
      option.setName('responses_list').setDescription('List separated by ";"').setRequired(true)
    )
];

export default COMMANDS;
