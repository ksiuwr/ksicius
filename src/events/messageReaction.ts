import { Events } from 'discord.js';

import {
  addRoleOnReactionAdded,
  removeRoleOnReactionRemoved
} from '../modules/roleReactionManager';
import { BotEvent } from '../types';

const events: Array<BotEvent> = [
  {
    name: Events.MessageReactionAdd,
    execute: (messageReaction, user) => {
      addRoleOnReactionAdded(messageReaction, user);
    }
  },
  {
    name: Events.MessageReactionRemove,
    execute: (messageReaction, user) => {
      removeRoleOnReactionRemoved(messageReaction, user);
    }
  }
];

export default events;
