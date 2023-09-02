import { EmbedBuilder } from 'discord.js';
import { discordConfig } from '../config';

export const buildErrorEmbed = (description: string): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setTitle(':warning: Oops!')
    .setColor(discordConfig.botErrorEmbedColor)
    .setDescription(description);

  return embed;
};

export const buildInfoEmbed = (title: string, description: string): EmbedBuilder => {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(discordConfig.botInfoEmbedColor)
    .setDescription(description);
  return embed;
};

