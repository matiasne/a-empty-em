import { pgEnum, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core'

export const userRoleEnum = pgEnum('user_role', ['admin', 'moderator', 'user'])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  role: userRoleEnum('role').notNull().default('user'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type UserRole = (typeof userRoleEnum.enumValues)[number]