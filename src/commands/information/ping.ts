import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder().setName('ping').setDescription('Replies with Pong!'),
  run: async (interaction: CommandInteraction) => {
    try {
      await interaction.deferReply();
      const reply = await interaction.fetchReply();
      const ping = reply.createdTimestamp - interaction.createdTimestamp;
      await interaction.editReply(`Pong! :ping_pong: Client ping ${ping}ms`);
    } catch (error) {
      console.error({ error });
    }
  }
};