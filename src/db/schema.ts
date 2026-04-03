import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// ---------------------------------------------------------------------------
// Candidate profile — enums
// ---------------------------------------------------------------------------

export const maritalStatusEnum = pgEnum('marital_status', [
  'single',
  'married',
  'divorced',
  'widowed',
  'other',
])

export const educationStatusEnum = pgEnum('education_status', [
  'in_progress',
  'completed',
  'dropped',
])

// ---------------------------------------------------------------------------
// Candidate profile — main table
// ---------------------------------------------------------------------------

/**
 * Core personal and contact information for a candidate.
 * Work experience, education, and hobbies are stored in their own tables
 * and linked via candidate_id (foreign key).
 */
export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),

  // Personal info
  firstName: varchar('first_name', { length: 100 }).notNull(),
  lastName: varchar('last_name', { length: 100 }).notNull(),
  age: integer('age'),
  dni: varchar('dni', { length: 20 }).unique(),
  nationality: varchar('nationality', { length: 100 }),
  maritalStatus: maritalStatusEnum('marital_status'),

  // Contact info
  address: text('address'),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }).notNull().unique(),
  linkedin: varchar('linkedin', { length: 255 }),

  // Professional summary
  summary: text('summary'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Candidate = typeof candidates.$inferSelect
export type NewCandidate = typeof candidates.$inferInsert

// ---------------------------------------------------------------------------
// Candidate profile — work experience
// ---------------------------------------------------------------------------

/**
 * Each row represents one work-experience entry belonging to a candidate.
 * end_date is nullable to represent current/ongoing positions.
 */
export const workExperiences = pgTable('work_experiences', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),

  company: varchar('company', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }).notNull(),
  startDate: varchar('start_date', { length: 7 }).notNull(), // YYYY-MM
  endDate: varchar('end_date', { length: 7 }), // YYYY-MM — null means current
  description: text('description'),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type WorkExperience = typeof workExperiences.$inferSelect
export type NewWorkExperience = typeof workExperiences.$inferInsert

// ---------------------------------------------------------------------------
// Candidate profile — education
// ---------------------------------------------------------------------------

export const educations = pgTable('educations', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),

  university: varchar('university', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  status: educationStatusEnum('status').notNull(),

  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Education = typeof educations.$inferSelect
export type NewEducation = typeof educations.$inferInsert

// ---------------------------------------------------------------------------
// Candidate profile — hobbies
// ---------------------------------------------------------------------------

/**
 * Stored as individual rows (one hobby per row) so they can be queried,
 * filtered, and modified without replacing the whole array.
 */
export const hobbies = pgTable('hobbies', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),

  hobby: varchar('hobby', { length: 100 }).notNull(),
})

export type Hobby = typeof hobbies.$inferSelect
export type NewHobby = typeof hobbies.$inferInsert