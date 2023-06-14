import { ImmutableObject } from 'seamless-immutable'

export interface Config {
  xmin: number,
  ymin: number,
  xmax: number,
  ymax: number,
  srsWkid: number,
  initialZoom: number,
  minZoom: number,
  rotationEnabled: boolean
}

export type IMConfig = ImmutableObject<Config>
