import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  REST,
  Routes
} from 'discord.js';
import { command } from './commands/ping';
import { TSlashCommand } from './types';
import dotenv from 'dotenv';

dotenv.config();

// import path from 'node:path';
// import fs from 'fs';

(async () => {
  const client = new Client({ intents: [GatewayIntentBits.Guilds] });
  client.slashCommands = new Collection();
  const { data } = command;

  client.slashCommands.set(data.name, command);
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  await rest.put(
    Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
    { body: [data] }
  );

  client.once(Events.ClientReady, (c) => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  client.on(Events.InteractionCreate, (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;
    const { run } = client.slashCommands.get(commandName) ?? {};
    run && run(interaction);
  });

  client.login(process.env.DISCORD_TOKEN);
})();


declare module 'discord.js' {
  export interface Client {
    slashCommands: Collection<string, TSlashCommand>;
  }
}