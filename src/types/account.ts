export type GameVersion = { major: number; minor: number }

export interface Account {
  twitchId: string
  gameVersion: GameVersion
  serializedState: string
  date?: number
}
