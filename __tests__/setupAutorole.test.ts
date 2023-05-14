import { ConfigModel } from '../src/models/config';
import { giveAutorole } from '../src/modules/setupAutorole';
import { GuildMember, GuildMemberRoleManager } from 'discord.js';


describe("giveAutorole", () => {
	const rolemanager = ({
		add : jest.fn(),
	} as unknown) as GuildMemberRoleManager
	const member = ({
		roles: rolemanager,
	} as unknown) as GuildMember;

	const config = {
		IS_AUTOROLE_ENABLED : false
	}

	it("shouldn't set role", async () => {
		jest.spyOn(ConfigModel, 'findOne').mockResolvedValue(config);
		await giveAutorole(member);
		expect(rolemanager.add).not.toHaveBeenCalled();
	});
});
