import { ConfigModel } from '../src/models/config';
import { sendWelcomeMessage } from '../src/modules/welcomeMessage';
import { GuildMember } from 'discord.js';


describe("sendWelcomeMessage", () => {
	const member = ({
		send: jest.fn(),
	} as unknown) as GuildMember;

	const config = {
		WELCOME_MESSAGE: 'wiadomosc'
	}

	it("should send message", async () => {
		jest.spyOn(ConfigModel, 'findOne').mockResolvedValue(config);
		await sendWelcomeMessage(member);
		expect(member.send).toHaveBeenCalledWith('wiadomosc');
	});
});
