import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	Interaction,
	Partials,
	REST,
	Routes
} from 'discord.js';
import * as path from 'path';

import { CLIENT_ID, GUILD_ID, TOKEN } from './config';
import { BotEvent, SlashCommand } from './types';
import { forEeachJs } from './utils/dynamicImport';
import { isBotEvent, isSlashCommand } from './utils/typeGuards';

const discordBot = new (class {
	client: Client;
	initialized: boolean;

	constructor() {
		this.client = new Client({
			intents: [
				GatewayIntentBits.Guilds,
				GatewayIntentBits.GuildMessages,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.MessageContent,
				GatewayIntentBits.GuildMembers,
				GatewayIntentBits.GuildMessageReactions,
				GatewayIntentBits.GuildScheduledEvents
			],
			partials: [Partials.Message, Partials.Channel, Partials.Reaction]
		});
		this.client.slashCommands = new Collection<string, SlashCommand>();
		this.client.cooldowns = new Collection<string, number>();

		this.initialized = false;
	}
})();

const registerEvent = (client: Client, botEvent: BotEvent) => {
	if (botEvent.once) {
		client.once(botEvent.name, (...args) => botEvent.execute(...args));
	} else {
		client.on(botEvent.name, (...args) => botEvent.execute(...args));
	}
};

const registerSlashCommand = (client: Client, slashCommand: SlashCommand) => {
	client.slashCommands.set(slashCommand.command.name, slashCommand);
};

const uploadSlashCommands = async (client: Client) => {
	const rest = new REST({ version: '10' }).setToken(TOKEN);
	const commands = Array.from(client.slashCommands.values()).map(
		slashCommand => slashCommand.command
	);

	console.log('Deploying slash commands');

	try {
		await rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), {
			body: commands.map(command => command.toJSON())
		});

		console.log(`Successfully deployed slash command(s)`);
	} catch (ex) {
		console.error(ex);
	}
};

const subscribeToSlashCommands = (client: Client) => {
	client.on(Events.InteractionCreate, (interaction: Interaction) => {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.slashCommands.get(interaction.commandName);
			const cooldown = interaction.client.cooldowns.get(
				`${interaction.commandName}-${interaction.user.username}`
			);
			if (!command) return;
			if (command.cooldown && cooldown) {
				if (Date.now() < cooldown) {
					interaction.reply(
						`You have to wait ${Math.floor(
							Math.abs(Date.now() - cooldown) / 1000
						)} second(s) to use this command again.`
					);
					setTimeout(() => interaction.deleteReply(), 5000);
					return;
				}
				interaction.client.cooldowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.cooldown * 1000
				);
				setTimeout(() => {
					interaction.client.cooldowns.delete(
						`${interaction.commandName}-${interaction.user.username}`
					);
				}, command.cooldown * 1000);
			} else if (command.cooldown && !cooldown) {
				interaction.client.cooldowns.set(
					`${interaction.commandName}-${interaction.user.username}`,
					Date.now() + command.cooldown * 1000
				);
			}
			command.execute(interaction);
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.slashCommands.get(interaction.commandName);
			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
			try {
				if (!command.autocomplete) return;
				command.autocomplete(interaction);
			} catch (error) {
				console.error(error);
			}
		}
	});
};

export const initializeBot = async () => {
	const client = discordBot.client;

	const eventsDir = path.join(__dirname, 'events');
	const commandsDir = path.join(__dirname, 'slashCommands');

	const loginPromise = client.login(TOKEN);

	const loadEventsPromise = forEeachJs(eventsDir, event => {
		if (isBotEvent(event)) {
			registerEvent(client, event);
		}
	});

	const loadCommandsPromise = forEeachJs(commandsDir, slashCommand => {
		if (isSlashCommand(slashCommand)) {
			registerSlashCommand(client, slashCommand);
		}
	});

	subscribeToSlashCommands(client);

	await Promise.all([loginPromise, loadEventsPromise, loadCommandsPromise]).then(() => {
		uploadSlashCommands(client);
	});

	discordBot.initialized = true;
};

export const getClient = async () => {
	if (!discordBot.initialized) await initializeBot();
	return discordBot.client;
};
