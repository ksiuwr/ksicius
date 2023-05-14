import { ConfigModel } from '../src/models/config';
import { giveAutorole, setAutoroleEnabled  } from '../src/modules/setupAutorole';
import {
	ChatInputCommandInteraction,
	CommandInteractionOption,
	CommandInteractionOptionResolver,
	GuildMember,
	GuildMemberRoleManager
} from 'discord.js';


describe("giveAutorole", () => {
	const rolemanager = ({
		add : jest.fn(),
	} as unknown) as GuildMemberRoleManager
	const member = ({
		roles: rolemanager,
	} as unknown) as GuildMember

	const config = {
		IS_AUTOROLE_ENABLED : false
	}

	it("shouldn't set role", async () => {
		jest.spyOn(ConfigModel, 'findOne').mockResolvedValue(config);
		await giveAutorole(member);
		expect(rolemanager.add).not.toHaveBeenCalled();
	});
});

describe("setAutoroleEnabled", () => {
	const option = ({
		value: true
	} as unknown) as CommandInteractionOption

	const optionresolver = ({
		data: [option]
	} as unknown) as CommandInteractionOptionResolver

	const interaction = ({
		options : optionresolver,
		reply : jest.fn()
	} as unknown) as ChatInputCommandInteraction

	const config = {
		IS_AUTOROLE_ENABLED : false,
		save : jest.fn()
	}

	jest.useFakeTimers();
	jest.spyOn(global, 'setTimeout');


	it("should change IS_AUTOROLE_ENABLED", async () => {
		jest.spyOn(ConfigModel, 'findOne').mockResolvedValue(config);
		await setAutoroleEnabled(interaction);
		expect(interaction.reply).toHaveBeenCalled();
		expect(config.IS_AUTOROLE_ENABLED).toBe(true);
		expect(config.save).toHaveBeenCalled();
	});
});

