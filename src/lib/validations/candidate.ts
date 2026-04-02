import { z } from 'zod'

// ─── Shared helpers ───────────────────────────────────────────────────────────

/**
 * YYYY-MM date string (e.g. "2020-03").
 * Only the year-month portion is required; the day is optional.
 */
const dateString = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Date must be in YYYY-MM format')

// ─── Skill Level ─────────────────────────────────────────────────────────────

export const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const
export type SkillLevel = (typeof SKILL_LEVELS)[number]

// ─── Candidate ───────────────────────────────────────────────────────────────

export const createCandidateSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(255, 'First name must be at most 255 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(255, 'Last name must be at most 255 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be at most 255 characters'),
  phone: z
    .string()
    .max(50, 'Phone must be at most 50 characters')
    .optional(),
  location: z
    .string()
    .max(255, 'Location must be at most 255 characters')
    .optional(),
  headline: z
    .string()
    .max(500, 'Headline must be at most 500 characters')
    .optional(),
  summary: z.string().optional(),
})

export const updateCandidateSchema = createCandidateSchema.partial()

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>

// ─── Work Experience ─────────────────────────────────────────────────────────

export const createWorkExperienceSchema = z
  .object({
    company: z
      .string()
      .min(1, 'Company is required')
      .max(255, 'Company must be at most 255 characters'),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be at most 255 characters'),
    location: z
      .string()
      .max(255, 'Location must be at most 255 characters')
      .optional(),
    startDate: dateString,
    endDate: dateString.optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) return false
      return true
    },
    {
      message: 'End date is required when position is not current',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (data.endDate && data.startDate > data.endDate) return false
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

export const updateWorkExperienceSchema = z
  .object({
    company: z
      .string()
      .min(1, 'Company is required')
      .max(255, 'Company must be at most 255 characters')
      .optional(),
    title: z
      .string()
      .min(1, 'Title is required')
      .max(255, 'Title must be at most 255 characters')
      .optional(),
    location: z
      .string()
      .max(255, 'Location must be at most 255 characters')
      .optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate && data.startDate > data.endDate)
        return false
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

export type CreateWorkExperienceInput = z.infer<typeof createWorkExperienceSchema>
export type UpdateWorkExperienceInput = z.infer<typeof updateWorkExperienceSchema>

// ─── Education ───────────────────────────────────────────────────────────────

export const createEducationSchema = z
  .object({
    institution: z
      .string()
      .min(1, 'Institution is required')
      .max(255, 'Institution must be at most 255 characters'),
    degree: z
      .string()
      .min(1, 'Degree is required')
      .max(255, 'Degree must be at most 255 characters'),
    fieldOfStudy: z
      .string()
      .max(255, 'Field of study must be at most 255 characters')
      .optional(),
    startDate: dateString,
    endDate: dateString.optional(),
    current: z.boolean().default(false),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!data.current && !data.endDate) return false
      return true
    },
    {
      message: 'End date is required when education is not current',
      path: ['endDate'],
    }
  )
  .refine(
    (data) => {
      if (data.endDate && data.startDate > data.endDate) return false
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

export const updateEducationSchema = z
  .object({
    institution: z
      .string()
      .min(1, 'Institution is required')
      .max(255, 'Institution must be at most 255 characters')
      .optional(),
    degree: z
      .string()
      .min(1, 'Degree is required')
      .max(255, 'Degree must be at most 255 characters')
      .optional(),
    fieldOfStudy: z
      .string()
      .max(255, 'Field of study must be at most 255 characters')
      .optional(),
    startDate: dateString.optional(),
    endDate: dateString.optional(),
    current: z.boolean().optional(),
    description: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.startDate && data.endDate && data.startDate > data.endDate)
        return false
      return true
    },
    {
      message: 'End date must be after start date',
      path: ['endDate'],
    }
  )

export type CreateEducationInput = z.infer<typeof createEducationSchema>
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>

// ─── Skills ──────────────────────────────────────────────────────────────────

export const createSkillSchema = z.object({
  name: z
    .string()
    .min(1, 'Skill name is required')
    .max(255, 'Skill name must be at most 255 characters'),
  level: z.enum(SKILL_LEVELS).default('intermediate'),
  yearsOfExperience: z
    .number()
    .int('Years of experience must be a whole number')
    .min(0, 'Years of experience cannot be negative')
    .max(50, 'Years of experience must be at most 50')
    .optional(),
})

export const updateSkillSchema = createSkillSchema.partial()

export type CreateSkillInput = z.infer<typeof createSkillSchema>
export type UpdateSkillInput = z.infer<typeof updateSkillSchema>

// ─── Pagination ──────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce
    .number()
    .int()
    .min(1, 'Page must be at least 1')
    .default(1),
  limit: z.coerce
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(100, 'Limit must be at most 100')
    .default(20),
})

export type PaginationInput = z.infer<typeof paginationSchema>
