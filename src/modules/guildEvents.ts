import { GuildScheduledEvent, PartialGuildScheduledEvent } from 'discord.js';

/**
 * Function to log scheduled guild events
 * @param event Object with all information about scheduled event
 * @returns {void}
 */
export const logGuildEventCreated = async (event: GuildScheduledEvent) => {
	console.log(event);
};

/**
 * Function to log scheduled guild events
 * @param event Object with all information about scheduled event
 * @returns {void}
 */
export const logGuildEventDeleted = async (
	event: GuildScheduledEvent | PartialGuildScheduledEvent
) => {
	console.log(event);
};

/**
 * Function to log scheduled guild events
 * @param event Object with all information about scheduled event
 * @returns {void}
 */
export const logGuildEventUpdated = async (
	event: GuildScheduledEvent | PartialGuildScheduledEvent | null
) => {
	console.log(event);
};

/**
 * Function to log scheduled guild events
 * @param event Object with all information about scheduled event
 * @returns {void}
 */
export const logGuildEventUserAdd = async (
	event: GuildScheduledEvent | PartialGuildScheduledEvent
) => {
	console.log(event);
};

/**
 * Function to log scheduled guild events
 * @param event Object with all information about scheduled event
 * @returns {void}
 */
export const logGuildEventUserRemove = async (
	event: GuildScheduledEvent | PartialGuildScheduledEvent
) => {
	console.log(event);
};
