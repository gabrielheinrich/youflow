export interface Workout {
  id: string
  name: string
  createdUtc: number
  timeline: TimelineItem[]
}

interface TimelineItem {
  id: string
  exerciseId: string
  exerciseReps: number
  cooldownTimeSecs: number
}

export type VideoSourceType = "youtube"

export interface Exercise {
  id: string
  srcType: VideoSourceType
  name: string
  description: string
  startSecond: number
  endSecond: number
  thumbprintSecond?: number
}
