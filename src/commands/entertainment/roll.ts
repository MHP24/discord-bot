import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Generates random roll between 1 and your limit')
    .addIntegerOption(option => (
      option
        .setName('limit')
        .setDescription('Limit of your roll')
        .setRequired(false)
    )),
  run: async (interaction: CommandInteraction) => {
    try {
      const { value: limit } = interaction.options.get('limit') ?? {};
      const roll = Math.floor(Math.random() * Number(limit ?? 100));
      await interaction.reply(`${roll}`);
    } catch (error) {
      console.error({ error });
    }
  }
};