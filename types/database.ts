export interface LearningPath {
  id: string
  name: string
  description: string | null
  duration: string | null
  effort: string | null
  completion_standard: string | null
  created_at: string
  updated_at: string
}

export interface Unit {
  id: string
  learning_path_id: string
  name: string
  order_index: number
  complete_by: string | null
  created_at: string
  updated_at: string
}

export interface Section {
  id: string
  unit_id: string
  name: string
  code: string
  deadline: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface Topic {
  id: string
  section_id: string
  content: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface ProgressionRequirement {
  id: string
  section_id: string
  content: string
  order_index: number
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface SectionResource {
  id: string
  section_id: string
  name: string
  url: string | null
  description: string | null
  order_index: number
  created_at: string
  updated_at: string
}

export interface WeeklyRhythm {
  id: string
  learning_path_id: string
  day: string
  activity: string
  time: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface PhaseResource {
  id: string
  learning_path_id: string
  phase: string
  resources: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface UserTopicProgress {
  id: string
  user_id: string
  topic_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface UserProgressionProgress {
  id: string
  user_id: string
  progression_requirement_id: string
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface UserSectionProgress {
  id: string
  user_id: string
  section_id: string
  unlocked: boolean
  completed: boolean
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Composite types for UI
export interface SectionWithProgress extends Section {
  topics: (Topic & { progress?: UserTopicProgress })[]
  progression_requirements: (ProgressionRequirement & { progress?: UserProgressionProgress })[]
  resources: SectionResource[]
  user_progress?: UserSectionProgress
  is_unlocked: boolean
  all_requirements_met: boolean
}

export interface UnitWithSections extends Unit {
  sections: SectionWithProgress[]
}

export interface LearningPathWithDetails extends LearningPath {
  units: UnitWithSections[]
  weekly_rhythm: WeeklyRhythm[]
  phase_resources: PhaseResource[]
}
