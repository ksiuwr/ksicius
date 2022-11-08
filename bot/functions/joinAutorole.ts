import { Client, Snowflake } from "discord.js";

export function setupAutorole(client: Client, roleId: Snowflake){
    client.on('guildMemberAdd', async (member) => {
        const role = await member.guild.roles.fetch(roleId);
        if(role == null) return;
        member.roles.add(role);
    });
}
