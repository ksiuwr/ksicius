import { EmojiIdentifierResolvable, Snowflake } from 'discord.js';

export const ROLES_MAP = new Map<EmojiIdentifierResolvable, Snowflake>([
  ['📅', '1039585080110239853']
]);
export const ROLES_CHANNEL_ID = '1042922876686307348';
export const WELCOME_MESSAGE = `Cześć!
Witamy Cię serdecznie na Discordzie KSI. Na spotkaniu integracyjnym powiemy Wam parę słów o Kole, omówimy nasze projekty i Wasze propozycje na nowe inicjatywy. Będziecie mieli okazję, żeby zgłosić się do interesujących Was projektów. Przydzielimy Wam zadania i odpowiednie role. Również role na Discord oraz wiążące się z tym uprawnienia możecie wybierać najlepiej po omówieniu projektów, żebyście przypisali się do tego co was interesuje.
Więcej informacji o KSI znajdziesz tutaj:  ${process.env.KSI_101_LINK}
Jeśli masz jakiekolwiek pytania, możesz zadawać je wątku Q&A 😉
Do zobaczenia! 
`;
