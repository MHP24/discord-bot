import dotenv from 'dotenv';
dotenv.config();

export const httpCredentials = {
  catApiUrl: process.env.CAT_API_URL || '',
  dogApiUrl: process.env.DOG_API_URL || '',
  jokeApiUrl: process.env.JOKE_API_URL || ''
};