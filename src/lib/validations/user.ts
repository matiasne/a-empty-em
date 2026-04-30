import { z } from 'zod'

export const userRoleSchema = z.enum(['admin', 'moderator', 'user'], {
  errorMap: () => ({ message: 'Role must be admin, moderator, or user' }),
})

export const createUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(255, 'Name must be less than 255 characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(255, 'Email must be less than 255 characters'),
  role: userRoleSchema.default('user'),
})

export const updateUserSchema = createUserSchema.partial()

export type CreateUserInput = z.infer<typeof createUserSchema>
export type UpdateUserInput = z.infer<typeof updateUserSchema>