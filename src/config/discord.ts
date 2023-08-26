import dotenv from 'dotenv';
dotenv.config();

export const discordConfig = {
  token: process.env.DISCORD_TOKEN || '',
  clientId: process.env.DISCORD_CLIENT_ID || '',
  botPicture: process.env.DISCORD_BOT_PICTURE || ''
};