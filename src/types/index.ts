// Global type definitions
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// ---------------------------------------------------------------------------
// Candidate profile — domain types
// ---------------------------------------------------------------------------

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'other'
export type EducationStatus = 'in_progress' | 'completed' | 'dropped'

/** A single work-experience entry as returned from the database. */
export interface WorkExperience {
  id: number
  candidateId: number
  company: string
  role: string
  /** Month-precision start date in YYYY-MM format. */
  startDate: string
  /** Month-precision end date in YYYY-MM format. Null means current position. */
  endDate: string | null
  description: string | null
  createdAt: Date
  updatedAt: Date
}

/** A single education entry as returned from the database. */
export interface Education {
  id: number
  candidateId: number
  university: string
  degree: string
  status: EducationStatus
  createdAt: Date
  updatedAt: Date
}

/** A single hobby entry as returned from the database. */
export interface Hobby {
  id: number
  candidateId: number
  hobby: string
}

/** Candidate row as returned from the database (flat, without relations). */
export interface Candidate {
  id: number
  firstName: string
  lastName: string
  age: number | null
  dni: string | null
  nationality: string | null
  maritalStatus: MaritalStatus | null
  address: string | null
  phone: string | null
  email: string
  linkedin: string | null
  summary: string | null
  createdAt: Date
  updatedAt: Date
}

/** Candidate with all related collections eagerly loaded. */
export interface CandidateWithRelations extends Candidate {
  workExperiences: WorkExperience[]
  educations: Education[]
  /** Flat list of hobby strings (projected from the hobbies join table). */
  hobbies: string[]
}