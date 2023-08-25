import path from 'node:path';
import fs from 'fs';
import dotenv from 'dotenv';
import { Collection, REST } from 'discord.js';
import { TLoadCommands, TSlashCommand } from '../../types';
import { Routes } from 'discord.js';

dotenv.config();

const getCommands = () => {
  const baseCommandsPath = '../../commands';

  return (fs.readdirSync(path.join(__dirname, baseCommandsPath)).map((category) => {
    const commandsPath = `${baseCommandsPath}/${category}`;
    return {
      category,
      commandsPath,
      commands: fs.readdirSync(path.join(__dirname, commandsPath))
        .filter(command => command.match(/\.(ts|js)$/))
    };
  }));
};


const loadCommand = async (commandPath: string): Promise<TSlashCommand | null> => {
  try {
    return await import(path.join(commandPath));
  } catch (error) {
    console.log({ error });
    return null;
  }
};


export const loadCommands = async (): Promise<TLoadCommands[] | null> => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);
    const commandsData = getCommands();

    const commands = (
      await Promise.all(
        commandsData.map(async ({ commandsPath, commands }) => {
          const folder = path.join(__dirname, commandsPath);
          return await Promise.all(commands.map((command) => loadCommand(path.join(folder, command))));
        })
      )
    ).flat().filter(command => command) as (TLoadCommands | null)[];

    await rest.put(
      Routes.applicationCommands(process.env.DISCORD_CLIENT_ID!),
      { body: commands.map((cmd) => cmd?.command?.data) }
    );

    return commands as TLoadCommands[];
  } catch (error) {
    console.error({ error });
    return null;
  }
};


export const enableCommands = async (commands: TLoadCommands[]) => {
  const collection = new Collection<string, TSlashCommand>();
  commands.forEach(({ command }) => {
    collection.set(command!.data.name, command!);
  });
  return collection;
};