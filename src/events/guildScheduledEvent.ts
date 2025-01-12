import { Events } from 'discord.js';

import { logGuildEventCreated } from '../modules/guildEvents';
import { removeRoleOnReactionRemoved } from '../modules/roleReactionManager';
import { BotEvent } from '../types';

const events: Array<BotEvent> = [
	{
		name: Events.GuildScheduledEventCreate,
		execute: event => {
			logGuildEventCreated(event);
		}
	},
	{
		name: Events.GuildScheduledEventDelete,
		execute: event => {
			logGuildEventCreated(event);
		}
	},
	{
		name: Events.GuildScheduledEventUpdate,
		execute: (messageReaction, user) => {
			removeRoleOnReactionRemoved(messageReaction, user);
		}
	},
	{
		name: Events.GuildScheduledEventUserAdd,
		execute: (messageReaction, user) => {
			removeRoleOnReactionRemoved(messageReaction, user);
		}
	},
	{
		name: Events.GuildScheduledEventUserRemove,
		execute: (messageReaction, user) => {
			removeRoleOnReactionRemoved(messageReaction, user);
		}
	}
];

export default events;
