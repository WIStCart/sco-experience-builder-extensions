import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  measurementId: string,
  pageTitle: string,
  hideConfig: boolean,
  initialized: boolean
}

export type IMConfig = ImmutableObject<Config>
