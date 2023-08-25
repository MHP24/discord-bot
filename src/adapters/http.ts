import axios from 'axios';

export const get = async (url: string, body: unknown = {}) => {
  const { data } = await axios.get(url, body!);
  return data;
};

export const post = async (url: string, body: unknown = {}) => {
  const { data } = await axios.post(url, body!);
  return data;
};