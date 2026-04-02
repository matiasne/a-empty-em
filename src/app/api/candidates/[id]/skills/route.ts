/**
 * @openapi
 * /api/candidates/{id}/skills:
 *   post:
 *     summary: Add a skill
 *     description: Adds a skill to the candidate profile.
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSkillInput'
 *     responses:
 *       201:
 *         description: Skill created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Invalid candidate id.
 *       404:
 *         description: Candidate not found.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { createSkillSchema } from '@/lib/validations/candidate'
import { getCandidateById, createSkill } from '@/lib/services/candidate'
import {
  created,
  badRequest,
  notFound,
  handleRoute,
  validationError,
  parseId,
} from '@/lib/api-response'

type RouteContext = { params: { id: string } }

export async function POST(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const exists = await getCandidateById(candidateId)
    if (!exists) return notFound('Candidate')

    const body = await request.json()
    const parsed = createSkillSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const skill = await createSkill(candidateId, parsed.data)
    return created(skill)
  })
}
