/**
 * @openapi
 * /api/candidates/{id}/skills/{skillId}:
 *   put:
 *     summary: Update a skill
 *     description: Updates a specific skill belonging to the candidate.
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skill id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSkillInput'
 *     responses:
 *       200:
 *         description: Skill updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Skill'
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Skill not found.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a skill
 *     description: Removes a specific skill from the candidate profile.
 *     tags:
 *       - Skills
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: skillId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Skill id.
 *     responses:
 *       204:
 *         description: Skill deleted successfully.
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Skill not found.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { updateSkillSchema } from '@/lib/validations/candidate'
import { updateSkill, deleteSkill } from '@/lib/services/candidate'
import {
  ok,
  noContent,
  badRequest,
  notFound,
  handleRoute,
  validationError,
  parseId,
} from '@/lib/api-response'

type RouteContext = { params: { id: string; skillId: string } }

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const skillId = parseId(params.skillId)
    if (skillId === null) return badRequest('Invalid skill id')

    const body = await request.json()
    const parsed = updateSkillSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const skill = await updateSkill(candidateId, skillId, parsed.data)
    if (!skill) return notFound('Skill')

    return ok(skill)
  })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const skillId = parseId(params.skillId)
    if (skillId === null) return badRequest('Invalid skill id')

    const deleted = await deleteSkill(candidateId, skillId)
    if (!deleted) return notFound('Skill')

    return noContent()
  })
}
