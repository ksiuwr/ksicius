import { Events } from 'discord.js';

import { giveAutorole } from '../modules/setupAutorole';
import { sendWelcomeMessage } from '../modules/welcomeMessage';
import { BotEvent } from '../types';

const event: BotEvent = {
  name: Events.GuildMemberAdd,
  execute: member => {
    giveAutorole(member);
    sendWelcomeMessage(member);
  }
};

export default event;
