import { eq, count, sql } from 'drizzle-orm'
import { db } from '@/db'
import {
  candidates,
  workExperience,
  education,
  skills,
  type Candidate,
  type WorkExperience,
  type Education,
  type Skill,
} from '@/db/schema'
import type {
  CreateCandidateInput,
  UpdateCandidateInput,
  CreateWorkExperienceInput,
  UpdateWorkExperienceInput,
  CreateEducationInput,
  UpdateEducationInput,
  CreateSkillInput,
  UpdateSkillInput,
  PaginationInput,
} from '@/lib/validations/candidate'
import type { PaginatedResponse } from '@/types'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CandidateWithRelations extends Candidate {
  workExperience: WorkExperience[]
  education: Education[]
  skills: Skill[]
}

// ─── Candidate CRUD ──────────────────────────────────────────────────────────

/**
 * Returns a paginated list of candidates (without nested relations for
 * performance; use getCandidateById for the full profile).
 */
export async function getCandidates(
  pagination: PaginationInput
): Promise<PaginatedResponse<Candidate>> {
  const { page, limit } = pagination
  const offset = (page - 1) * limit

  const [rows, [{ value: total }]] = await Promise.all([
    db
      .select()
      .from(candidates)
      .orderBy(candidates.createdAt)
      .limit(limit)
      .offset(offset),
    db.select({ value: count() }).from(candidates),
  ])

  return {
    data: rows,
    pagination: {
      page,
      limit,
      total: Number(total),
      totalPages: Math.ceil(Number(total) / limit),
    },
  }
}

/**
 * Returns a single candidate with all related work experience, education,
 * and skills. Returns null when the candidate does not exist.
 */
export async function getCandidateById(
  id: number
): Promise<CandidateWithRelations | null> {
  const [candidate] = await db
    .select()
    .from(candidates)
    .where(eq(candidates.id, id))
    .limit(1)

  if (!candidate) return null

  const [experienceRows, educationRows, skillRows] = await Promise.all([
    db
      .select()
      .from(workExperience)
      .where(eq(workExperience.candidateId, id))
      .orderBy(workExperience.startDate),
    db
      .select()
      .from(education)
      .where(eq(education.candidateId, id))
      .orderBy(education.startDate),
    db
      .select()
      .from(skills)
      .where(eq(skills.candidateId, id))
      .orderBy(skills.name),
  ])

  return {
    ...candidate,
    workExperience: experienceRows,
    education: educationRows,
    skills: skillRows,
  }
}

/**
 * Creates a new candidate profile and returns the created record.
 */
export async function createCandidate(
  input: CreateCandidateInput
): Promise<Candidate> {
  const [created] = await db.insert(candidates).values(input).returning()
  return created
}

/**
 * Updates an existing candidate. Returns the updated record or null when
 * the candidate does not exist.
 */
export async function updateCandidate(
  id: number,
  input: UpdateCandidateInput
): Promise<Candidate | null> {
  const [updated] = await db
    .update(candidates)
    .set({ ...input, updatedAt: sql`now()` })
    .where(eq(candidates.id, id))
    .returning()

  return updated ?? null
}

/**
 * Deletes a candidate by id. Returns true when the record was deleted,
 * false when it did not exist.
 */
export async function deleteCandidate(id: number): Promise<boolean> {
  const [deleted] = await db
    .delete(candidates)
    .where(eq(candidates.id, id))
    .returning({ id: candidates.id })

  return !!deleted
}

// ─── Work Experience ─────────────────────────────────────────────────────────

/**
 * Adds a work experience entry to an existing candidate.
 */
export async function createWorkExperience(
  candidateId: number,
  input: CreateWorkExperienceInput
): Promise<WorkExperience> {
  const [created] = await db
    .insert(workExperience)
    .values({ ...input, candidateId })
    .returning()
  return created
}

/**
 * Updates a work experience entry that belongs to the given candidate.
 * Returns the updated record or null when not found.
 */
export async function updateWorkExperience(
  candidateId: number,
  experienceId: number,
  input: UpdateWorkExperienceInput
): Promise<WorkExperience | null> {
  const [updated] = await db
    .update(workExperience)
    .set({ ...input, updatedAt: sql`now()` })
    .where(
      sql`${workExperience.id} = ${experienceId} AND ${workExperience.candidateId} = ${candidateId}`
    )
    .returning()

  return updated ?? null
}

/**
 * Deletes a work experience entry that belongs to the given candidate.
 * Returns true when deleted, false when not found.
 */
export async function deleteWorkExperience(
  candidateId: number,
  experienceId: number
): Promise<boolean> {
  const [deleted] = await db
    .delete(workExperience)
    .where(
      sql`${workExperience.id} = ${experienceId} AND ${workExperience.candidateId} = ${candidateId}`
    )
    .returning({ id: workExperience.id })

  return !!deleted
}

// ─── Education ───────────────────────────────────────────────────────────────

/**
 * Adds an education entry to an existing candidate.
 */
export async function createEducation(
  candidateId: number,
  input: CreateEducationInput
): Promise<Education> {
  const [created] = await db
    .insert(education)
    .values({ ...input, candidateId })
    .returning()
  return created
}

/**
 * Updates an education entry that belongs to the given candidate.
 * Returns the updated record or null when not found.
 */
export async function updateEducation(
  candidateId: number,
  educationId: number,
  input: UpdateEducationInput
): Promise<Education | null> {
  const [updated] = await db
    .update(education)
    .set({ ...input, updatedAt: sql`now()` })
    .where(
      sql`${education.id} = ${educationId} AND ${education.candidateId} = ${candidateId}`
    )
    .returning()

  return updated ?? null
}

/**
 * Deletes an education entry that belongs to the given candidate.
 * Returns true when deleted, false when not found.
 */
export async function deleteEducation(
  candidateId: number,
  educationId: number
): Promise<boolean> {
  const [deleted] = await db
    .delete(education)
    .where(
      sql`${education.id} = ${educationId} AND ${education.candidateId} = ${candidateId}`
    )
    .returning({ id: education.id })

  return !!deleted
}

// ─── Skills ──────────────────────────────────────────────────────────────────

/**
 * Adds a skill to an existing candidate.
 */
export async function createSkill(
  candidateId: number,
  input: CreateSkillInput
): Promise<Skill> {
  const [created] = await db
    .insert(skills)
    .values({ ...input, candidateId })
    .returning()
  return created
}

/**
 * Updates a skill that belongs to the given candidate.
 * Returns the updated record or null when not found.
 */
export async function updateSkill(
  candidateId: number,
  skillId: number,
  input: UpdateSkillInput
): Promise<Skill | null> {
  const [updated] = await db
    .update(skills)
    .set({ ...input, updatedAt: sql`now()` })
    .where(
      sql`${skills.id} = ${skillId} AND ${skills.candidateId} = ${candidateId}`
    )
    .returning()

  return updated ?? null
}

/**
 * Deletes a skill that belongs to the given candidate.
 * Returns true when deleted, false when not found.
 */
export async function deleteSkill(
  candidateId: number,
  skillId: number
): Promise<boolean> {
  const [deleted] = await db
    .delete(skills)
    .where(
      sql`${skills.id} = ${skillId} AND ${skills.candidateId} = ${candidateId}`
    )
    .returning({ id: skills.id })

  return !!deleted
}
