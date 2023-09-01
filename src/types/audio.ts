export type TQueue = {
  song: {
    name: string,
    author: string,
    duration: number,
    link: string,
    data: Buffer,
    thumbnail: string,
  },
  requestedBy: {
    name: string,
    profilpicture: string
  }
}[]