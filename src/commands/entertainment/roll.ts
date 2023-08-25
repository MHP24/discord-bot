import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Generates random roll between 1 and your limit')
    .addIntegerOption(option => (
      option
        .setName('limit')
        .setDescription('Limit of your roll')
        .setRequired(true)
    )),
  run: async (interaction: CommandInteraction) => {
    const { value: limit } = interaction.options.get('limit')!;
    const roll = Math.floor(Math.random() * Number(limit));
    await interaction.reply(`${roll}`);
  }
};