// import { ConfigModel } from '../src/models/config';
// import { isAbleToEdit } from '../src/utils/isAbleToEdit';
import isAbleToEdit from "../src/utils/isAbleToEdit";
import { Role, Collection, ChatInputCommandInteraction, GuildMember, GuildMemberRoleManager } from 'discord.js';


describe("isAbleToEdit", () => {
	const role = ({
	} as unknown) as Role

	const rolemanager = ({
		cache : Collection.combineEntries([["a", role], ["b", role], ["c", role]], () => (role)),
	} as unknown) as GuildMemberRoleManager

	const member = ({
		roles: rolemanager,
	} as unknown) as GuildMember

	const interaction = ({
		member : member,
	} as unknown) as ChatInputCommandInteraction


	it("should return true", async () => {
		expect(isAbleToEdit(interaction, "a")).toBe(true);
	});

	it("should return true", async () => {
		expect(isAbleToEdit(interaction, "c")).toBe(true);
	});

	it("should return false", async () => {
		expect(isAbleToEdit(interaction, "f")).toBe(false);
	});

});
