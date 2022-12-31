import { ChatInputCommandInteraction, GuildMember, codeBlock } from 'discord.js';

import { AUTOROLE_ID } from '../config';
import { ConfigModel } from '../models/config';

/**
 * Function to give new guild member autorole
 * @param interaction object which has all information about new member
 */
export const giveAutorole = async (member: GuildMember) => {
  const config = await ConfigModel.findOne({});

  if (config === null || config.IS_AUTOROLE_ENABLED === undefined) {
    const dmChannel = member.dmChannel ?? (await member.createDM());
    await dmChannel.send(
      `Cześć nie udało Ci się nadać roli automatycznie, ponieważ wystąpił błąd. Skontaktuj się z administracją serwera i podaj im ten komunikat: ${codeBlock(
        'Unable to fetch data from monogo'
      )}`
    );
    return;
  }

  if (config.IS_AUTOROLE_ENABLED === false) return;
  const role = await member.guild.roles.fetch(AUTOROLE_ID);
  if (role === null) return;
  member.roles.add(role);
};

/**
 * Function to enable or disable giving new members guest role
 * @param interaction Object with all information about used command and user
 * @returns Interaction replay
 */
export const setAutoroleEnabled = async (interaction: ChatInputCommandInteraction) => {
  setTimeout(() => interaction.deleteReply(), 10000);
  const autoroleEnabled = interaction.options.data[0].value as boolean;
  const config = await ConfigModel.findOne({});
  if (config === null || config.IS_AUTOROLE_ENABLED === undefined) {
    return interaction.reply({
      content: 'Unable to read config from MongoDB'
    });
  }
  config.IS_AUTOROLE_ENABLED = autoroleEnabled;
  config.save();

  return interaction.reply({
    content: `Successfully ${autoroleEnabled ? 'enabled' : 'disabled'} autorole`
  });
};
