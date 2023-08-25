import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  run: async (interaction: CommandInteraction) => {
    await interaction.reply('Pong!');
  }
};