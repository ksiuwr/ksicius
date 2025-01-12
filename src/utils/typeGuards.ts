import { BotEvent, SlashCommand } from '../types';

export const isSlashCommand = (param: unknown): param is SlashCommand => {
  const slashCommand = param as SlashCommand;
  return slashCommand.command !== undefined && slashCommand.execute !== undefined;
};

export const isBotEvent = (param: unknown): param is BotEvent => {
  const botEvent = param as BotEvent;
  return botEvent.name !== undefined && botEvent.execute !== undefined;
};
