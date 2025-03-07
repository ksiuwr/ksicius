import { Events } from 'discord.js';

import { setupRoleMessage } from '../modules/roleReactionManager';
import { BotEvent } from '../types';

const event: BotEvent = {
	name: Events.ClientReady,
	once: true,
	execute: client => {
		console.log('Ready');
		setupRoleMessage(client);
	}
};

export default event;
