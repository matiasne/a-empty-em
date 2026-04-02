import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  serial,
  smallint,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// ─── Users ───────────────────────────────────────────────────────────────────

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type User = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert

// ─── Candidate Profiles ───────────────────────────────────────────────────────

export const candidates = pgTable('candidates', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 255 }).notNull(),
  lastName: varchar('last_name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  phone: varchar('phone', { length: 50 }),
  location: varchar('location', { length: 255 }),
  headline: varchar('headline', { length: 500 }),
  summary: text('summary'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Candidate = typeof candidates.$inferSelect
export type NewCandidate = typeof candidates.$inferInsert

// ─── Work Experience ─────────────────────────────────────────────────────────

export const workExperience = pgTable('work_experience', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  company: varchar('company', { length: 255 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  location: varchar('location', { length: 255 }),
  startDate: varchar('start_date', { length: 20 }).notNull(),
  endDate: varchar('end_date', { length: 20 }),
  current: boolean('current').default(false).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type WorkExperience = typeof workExperience.$inferSelect
export type NewWorkExperience = typeof workExperience.$inferInsert

// ─── Education ───────────────────────────────────────────────────────────────

export const education = pgTable('education', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  institution: varchar('institution', { length: 255 }).notNull(),
  degree: varchar('degree', { length: 255 }).notNull(),
  fieldOfStudy: varchar('field_of_study', { length: 255 }),
  startDate: varchar('start_date', { length: 20 }).notNull(),
  endDate: varchar('end_date', { length: 20 }),
  current: boolean('current').default(false).notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Education = typeof education.$inferSelect
export type NewEducation = typeof education.$inferInsert

// ─── Skill Level Enum ────────────────────────────────────────────────────────

export const skillLevelEnum = pgEnum('skill_level', [
  'beginner',
  'intermediate',
  'advanced',
  'expert',
])

// ─── Skills ──────────────────────────────────────────────────────────────────

export const skills = pgTable('skills', {
  id: serial('id').primaryKey(),
  candidateId: integer('candidate_id')
    .notNull()
    .references(() => candidates.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  level: skillLevelEnum('level').default('intermediate').notNull(),
  yearsOfExperience: smallint('years_of_experience'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type Skill = typeof skills.$inferSelect
export type NewSkill = typeof skills.$inferInsert

// ─── Relations ───────────────────────────────────────────────────────────────

export const candidatesRelations = relations(candidates, ({ many }) => ({
  workExperience: many(workExperience),
  education: many(education),
  skills: many(skills),
}))

export const workExperienceRelations = relations(workExperience, ({ one }) => ({
  candidate: one(candidates, {
    fields: [workExperience.candidateId],
    references: [candidates.id],
  }),
}))

export const educationRelations = relations(education, ({ one }) => ({
  candidate: one(candidates, {
    fields: [education.candidateId],
    references: [candidates.id],
  }),
}))

export const skillsRelations = relations(skills, ({ one }) => ({
  candidate: one(candidates, {
    fields: [skills.candidateId],
    references: [candidates.id],
  }),
}))