import { z } from 'zod'

// ---------------------------------------------------------------------------
// Shared sub-schemas
// ---------------------------------------------------------------------------

/**
 * YYYY-MM date string used for work-experience start / end dates.
 * Keeps the model database-agnostic (no native Date column required) and
 * avoids timezone ambiguity for month-precision values.
 */
const yearMonthSchema = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'Date must be in YYYY-MM format')

// ---------------------------------------------------------------------------
// Work experience
// ---------------------------------------------------------------------------

/** Shared field definitions — used by both create and update schemas. */
const workExperienceBaseSchema = z.object({
  company: z
    .string()
    .min(1, 'Company is required')
    .max(255, 'Company must be 255 characters or less'),
  role: z
    .string()
    .min(1, 'Role is required')
    .max(255, 'Role must be 255 characters or less'),
  startDate: yearMonthSchema,
  /** Omit or pass null/undefined to indicate a current position. */
  endDate: yearMonthSchema.optional().nullable(),
  description: z
    .string()
    .max(2000, 'Description must be 2000 characters or less')
    .optional()
    .nullable(),
})

/** Refinement applied to both create and update to validate date ordering. */
const withDateOrderCheck = <T extends z.ZodTypeAny>(schema: T) =>
  schema.refine(
    (data: { startDate?: string; endDate?: string | null }) => {
      if (!data.startDate || !data.endDate) return true
      return data.startDate <= data.endDate
    },
    { message: 'End date must be on or after start date', path: ['endDate'] }
  )

export const workExperienceSchema = withDateOrderCheck(workExperienceBaseSchema)

export const updateWorkExperienceSchema = withDateOrderCheck(
  workExperienceBaseSchema.partial()
)

export type WorkExperienceInput = z.infer<typeof workExperienceSchema>
export type UpdateWorkExperienceInput = z.infer<
  typeof updateWorkExperienceSchema
>

// ---------------------------------------------------------------------------
// Education
// ---------------------------------------------------------------------------

export const educationSchema = z.object({
  university: z
    .string()
    .min(1, 'University is required')
    .max(255, 'University must be 255 characters or less'),
  degree: z
    .string()
    .min(1, 'Degree is required')
    .max(255, 'Degree must be 255 characters or less'),
  status: z.enum(['in_progress', 'completed', 'dropped'], {
    message: 'Status must be in_progress, completed, or dropped',
  }),
})

export const updateEducationSchema = educationSchema.partial()

export type EducationInput = z.infer<typeof educationSchema>
export type UpdateEducationInput = z.infer<typeof updateEducationSchema>

// ---------------------------------------------------------------------------
// Candidate (create)
// ---------------------------------------------------------------------------

export const createCandidateSchema = z.object({
  // Personal info
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(100, 'First name must be 100 characters or less'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(100, 'Last name must be 100 characters or less'),
  age: z
    .number()
    .int('Age must be a whole number')
    .min(16, 'Age must be at least 16')
    .max(100, 'Age must be 100 or less')
    .optional()
    .nullable(),
  dni: z
    .string()
    .max(20, 'DNI must be 20 characters or less')
    .optional()
    .nullable(),
  nationality: z
    .string()
    .max(100, 'Nationality must be 100 characters or less')
    .optional()
    .nullable(),
  maritalStatus: z
    .enum(['single', 'married', 'divorced', 'widowed', 'other'], {
      message:
        'Marital status must be single, married, divorced, widowed, or other',
    })
    .optional()
    .nullable(),

  // Contact info
  address: z
    .string()
    .max(500, 'Address must be 500 characters or less')
    .optional()
    .nullable(),
  phone: z
    .string()
    .max(30, 'Phone must be 30 characters or less')
    .optional()
    .nullable(),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be 255 characters or less'),
  linkedin: z
    .string()
    .url('LinkedIn must be a valid URL')
    .max(255, 'LinkedIn URL must be 255 characters or less')
    .optional()
    .nullable(),

  // Professional summary
  summary: z
    .string()
    .max(3000, 'Summary must be 3000 characters or less')
    .optional()
    .nullable(),

  // Related collections — accepted on creation for convenience
  workExperiences: z.array(workExperienceSchema).optional().default([]),
  educations: z.array(educationSchema).optional().default([]),
  hobbies: z
    .array(
      z
        .string()
        .min(1, 'Hobby must not be empty')
        .max(100, 'Hobby must be 100 characters or less')
    )
    .optional()
    .default([]),
})

export const updateCandidateSchema = createCandidateSchema
  .omit({ workExperiences: true, educations: true, hobbies: true })
  .partial()

export type CreateCandidateInput = z.infer<typeof createCandidateSchema>
export type UpdateCandidateInput = z.infer<typeof updateCandidateSchema>
