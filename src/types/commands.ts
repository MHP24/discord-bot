import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type TSlashCommand = {
  enabled?: boolean;
  data: SlashCommandBuilder
  run: (interaction: CommandInteraction) => Promise<void>
}