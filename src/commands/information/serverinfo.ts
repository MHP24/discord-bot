import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { discordConfig } from '../../config';
import { buildErrorEmbed } from '../../lib';

export const command = {
  data: new SlashCommandBuilder().setName('serverinfo')
    .setDescription('Provides current server information'),
  run: async (interaction: CommandInteraction) => {
    try {

      if (!interaction.inGuild()) {
        await interaction.reply({
          embeds: [buildErrorEmbed('You must to be in a server to use this command')]
        });
        return;
      }

      const { guild } = interaction;
      const { members, channels } = guild!;

      const { 0: textChannels, 2: voiceChannels, 4: categories } = (channels.cache)
        .reduce((acc: Record<string, number>, { type }) => {
          if (!acc[type]) {
            acc[type] = 0;
          }
          acc[type]++;

          return acc;
        }, {});

      const embed = new EmbedBuilder()
        .setTitle(`${guild!.name}`)
        .setColor(discordConfig.botInfoEmbedColor)
        .setFields([
          { name: 'Member count', value: members.guild.memberCount.toString(), inline: true },
          { name: 'Text channels', value: textChannels.toString(), inline: true },
          { name: 'Voice channels', value: voiceChannels.toString(), inline: true },
          { name: 'Category channels', value: categories.toString(), inline: true },
          { name: 'Role count', value: guild!.roles.cache.size.toString(), inline: true },
          { name: 'Owner', value: (await guild?.fetchOwner())?.user.tag ?? 'Nobody', inline: true }
        ])
        .setFooter({ text: `Server #${guild?.id} Created at ${guild?.createdAt.toDateString()}` });

      const serverThumbnail = guild?.iconURL({ size: 256 });
      Boolean(serverThumbnail) && embed.setThumbnail(serverThumbnail!);

      return await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error({ error });
      return await interaction.reply({
        embeds: [
          buildErrorEmbed('Failed getting server information :crying_cat_face:')
        ]
      });
    }
  }
};