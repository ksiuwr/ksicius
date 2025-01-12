import {
  AutocompleteInteraction,
  Collection,
  CommandInteraction,
  SlashCommandOptionsOnlyBuilder
} from 'discord.js';

export interface SlashCommand {
  command: SlashCommandOptionsOnlyBuilder;
  execute: (interaction: CommandInteraction) => void;
  autocomplete?: (interaction: AutocompleteInteraction) => void;
  cooldown?: number; // in seconds
}

export interface BotEvent {
  name: string;
  once?: boolean | false;
  execute: (...args) => void;
}

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, SlashCommand>;
    cooldowns: Collection<string, number>;
  }
}
