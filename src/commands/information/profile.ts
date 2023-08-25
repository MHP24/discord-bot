import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export const command = {
  data: new SlashCommandBuilder().setName('profile')
    .setDescription('Replies with your profile information'),
  run: async (interaction: CommandInteraction) => {
    const { id, avatar, username, globalName } = interaction.user;
    const embed = new EmbedBuilder()
      .setTitle(`${globalName}'s Profile`)
      .setColor(0x0099FF)
      .setThumbnail(`https://cdn.discordapp.com/avatars/${id}/${avatar}?size=1024`)
      .setFields([
        { name: 'Username', value: `${username}` },
        { name: 'Global name', value: `${globalName}` }
      ]);
    await interaction.reply({ embeds: [embed] });
  }
};