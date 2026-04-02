/**
 * @openapi
 * /api/candidates/{id}/experience/{experienceId}:
 *   put:
 *     summary: Update work experience
 *     description: Updates a specific work experience entry belonging to the candidate.
 *     tags:
 *       - Work Experience
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Work experience id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateWorkExperienceInput'
 *     responses:
 *       200:
 *         description: Work experience updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/WorkExperience'
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Work experience not found.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete work experience
 *     description: Removes a specific work experience entry from the candidate profile.
 *     tags:
 *       - Work Experience
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: experienceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Work experience id.
 *     responses:
 *       204:
 *         description: Work experience deleted successfully.
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Work experience not found.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { updateWorkExperienceSchema } from '@/lib/validations/candidate'
import {
  updateWorkExperience,
  deleteWorkExperience,
} from '@/lib/services/candidate'
import {
  ok,
  noContent,
  badRequest,
  notFound,
  handleRoute,
  validationError,
  parseId,
} from '@/lib/api-response'

type RouteContext = { params: { id: string; experienceId: string } }

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const experienceId = parseId(params.experienceId)
    if (experienceId === null) return badRequest('Invalid experience id')

    const body = await request.json()
    const parsed = updateWorkExperienceSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const experience = await updateWorkExperience(candidateId, experienceId, parsed.data)
    if (!experience) return notFound('Work experience')

    return ok(experience)
  })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const experienceId = parseId(params.experienceId)
    if (experienceId === null) return badRequest('Invalid experience id')

    const deleted = await deleteWorkExperience(candidateId, experienceId)
    if (!deleted) return notFound('Work experience')

    return noContent()
  })
}
