/**
 * @openapi
 * /api/candidates/{id}/education/{educationId}:
 *   put:
 *     summary: Update education
 *     description: Updates a specific education entry belonging to the candidate.
 *     tags:
 *       - Education
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: educationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Education id.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateEducationInput'
 *     responses:
 *       200:
 *         description: Education updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Education'
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Education entry not found.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete education
 *     description: Removes a specific education entry from the candidate profile.
 *     tags:
 *       - Education
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *       - in: path
 *         name: educationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Education id.
 *     responses:
 *       204:
 *         description: Education entry deleted successfully.
 *       400:
 *         description: Invalid id.
 *       404:
 *         description: Education entry not found.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { updateEducationSchema } from '@/lib/validations/candidate'
import { updateEducation, deleteEducation } from '@/lib/services/candidate'
import {
  ok,
  noContent,
  badRequest,
  notFound,
  handleRoute,
  validationError,
  parseId,
} from '@/lib/api-response'

type RouteContext = { params: { id: string; educationId: string } }

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const educationId = parseId(params.educationId)
    if (educationId === null) return badRequest('Invalid education id')

    const body = await request.json()
    const parsed = updateEducationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const educationEntry = await updateEducation(candidateId, educationId, parsed.data)
    if (!educationEntry) return notFound('Education')

    return ok(educationEntry)
  })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const candidateId = parseId(params.id)
    if (candidateId === null) return badRequest('Invalid candidate id')

    const educationId = parseId(params.educationId)
    if (educationId === null) return badRequest('Invalid education id')

    const deleted = await deleteEducation(candidateId, educationId)
    if (!deleted) return notFound('Education')

    return noContent()
  })
}
