import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder().setName('user').setDescription('Replies your username'),
  run: async (interaction: CommandInteraction) => {
    await interaction.reply(interaction.user.username);
  }
};