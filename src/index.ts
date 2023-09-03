import { TSongsQueue, TSlashCommand } from './types';
import { enableCommands, loadCommands } from './helpers';
import { client } from './client';
import { Collection } from 'discord.js';
import { discordConfig } from './config';

(async () => {
  const commands = await loadCommands();
  if (commands) {
    client.slashCommands = await enableCommands(commands);
  }
  client.guildTracks = new Map<string, TSongsQueue>();

  client.login(discordConfig.token);
})();

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, TSlashCommand>;
    guildTracks: Map<string, TSongsQueue>;
  }
}