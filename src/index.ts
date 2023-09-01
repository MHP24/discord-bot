import { TQueue, TSlashCommand } from './types';
import { enableCommands, loadCommands } from './helpers';
import { client } from './client';
import { Collection } from 'discord.js';
import { discordConfig } from './config';

(async () => {
  const commands = await loadCommands();
  if (commands) {
    client.slashCommands = await enableCommands(commands);
  }
  client.songQueue = new Map<string, TQueue>();

  client.login(discordConfig.token);
})();

declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, TSlashCommand>;
    songQueue: Map<string, TQueue>;
  }
}