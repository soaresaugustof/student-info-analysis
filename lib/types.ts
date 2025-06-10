export interface StudentData {
  student_id: string
  name: string
  gender: string
  age: number
  grade_level: string // Alterado para string para corresponder aos dados
  math_score: number
  reading_score: number
  writing_score: number
  attendance_rate: number
  parent_education: string
  study_hours: number
  internet_access: string
  lunch_type: string
  extra_activities: string
  final_result: string
}

export interface FilterState {
  gender: string
  gradeLevel: string
  finalResult: string
  parentEducation: string
}