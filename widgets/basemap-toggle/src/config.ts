import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  basemap: string
}

export type IMConfig = ImmutableObject<Config>
