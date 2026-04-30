import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  maxResults: number
  zoomScale: number
  placeholder: string
}

export type IMConfig = ImmutableObject<Config>
