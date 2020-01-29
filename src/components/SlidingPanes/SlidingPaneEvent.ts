import { EventType } from './EventType'

export interface SlidingPaneEvent {
  eventType: EventType
  payload: number | Array<{ max: number, min: number, width: number }>
}
