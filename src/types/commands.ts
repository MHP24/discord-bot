import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

export type TSlashCommand = {
  enabled?: boolean;
  data: Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
  run: (interaction: CommandInteraction) => Promise<void>
}

export type TLoadCommands = {
  command: TSlashCommand | null
}