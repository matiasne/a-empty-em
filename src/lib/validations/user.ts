import { z } from 'zod'

export const parentsAddressSchema = z.object({
  parentsAddressStreet: z
    .string()
    .min(1, "Parent's street address is required")
    .max(255, 'Street address must be less than 255 characters'),
  parentsAddressCity: z
    .string()
    .min(1, 'City is required')
    .max(100, 'City must be less than 100 characters'),
  parentsAddressState: z
    .string()
    .min(1, 'State / Province is required')
    .max(100, 'State must be less than 100 characters'),
  parentsAddressZip: z
    .string()
    .min(1, 'ZIP / Postal code is required')
    .max(20, 'ZIP code must be less than 20 characters'),
  parentsAddressCountry: z
    .string()
    .min(1, 'Country is required')
    .max(100, 'Country must be less than 100 characters'),
})

export const createUserSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(255, 'Name must be less than 255 characters'),
    email: z
      .string()
      .email('Invalid email address')
      .max(255, 'Email must be less than 255 characters'),
  })
  .merge(parentsAddressSchema)

export const updateUserSchema = createUserSchema.partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>