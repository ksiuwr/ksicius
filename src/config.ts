import { EmojiIdentifierResolvable, Snowflake } from 'discord.js';

export const ROLES_MAP = new Map<EmojiIdentifierResolvable, Snowflake>([
  ['📅', '1039585080110239853']
]);
export const ROLES_CHANNEL_ID = '1042922876686307348';

export const AUTOROLE_ID = '1039585080089260077';

export const TOKEN = process.env.TOKEN || '';
export const MONGO_LINK = process.env.MONGO_CONNECTION_LINK || '';
export const CLIENT_ID = process.env.CLIENT_ID || '';
export const GUILD_ID = process.env.GUILD_ID || '';
