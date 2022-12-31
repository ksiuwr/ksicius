import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';

const numbers = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];

export const createPoll = async (interaction: ChatInputCommandInteraction) => {
  const title = interaction.options.data[0].value as string;
  const optionsString = interaction.options.data[1].value as string;
  const optionsList = optionsString.split(';');
  const numbersList = numbers.slice(0, optionsList.length);

  const embed = createPollEmbed(title, interaction.user.username, optionsList, numbersList);

  const channel = interaction.channel;
  if (channel === null) {
    return;
  }

  const message = await channel.send({ embeds: [embed] });
  numbersList.forEach(async emoji => {
    await message.react(emoji);
  });

  await interaction.reply('.');
  await interaction.deleteReply();
};

const createPollEmbed = (
  title: string,
  author: string,
  options: string[],
  emojiNumbers: string[]
) => {
  const fields = [];
  for (let i = 0; i < options.length; i++) {
    const option = options[i];
    const emoji = emojiNumbers[i];
    const field: APIEmbedField = {
      name: `Option ${emoji}`,
      value: option,
      inline: true
    };
    fields.push(field);
  }

  const embed = new EmbedBuilder()
    .setTitle(title)
    .addFields(fields)
    .setColor('Gold')
    .setFooter({ text: author });

  return embed;
};
