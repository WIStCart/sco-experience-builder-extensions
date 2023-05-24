import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  groupName: string,
  groupedLayerTitles: string[],
  hiddenLayerTitles: string[],
}

export type IMConfig = ImmutableObject<Config>
