
export type TJokeTwoPart = {
  type: 'twopart',
  setup: string,
  delivery: string
}

export type TJokeSingle = {
  type: 'single',
  joke: string
}

export type TJoke = {
  category: string,
  id: number,
} & (TJokeSingle | TJokeTwoPart)