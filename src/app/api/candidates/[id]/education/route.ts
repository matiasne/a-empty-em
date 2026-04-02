/**
 * @openapi
 * /api/candidates/{id}/education:
 *   post:
 *     summary: Add education
 *     description: Adds an education entry to the candidate profile.
 *     tags:
 *       - Education
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
 *             $ref: '#/components/schemas/CreateEducationInput'
 *     responses:
 *       201:
 *         description: Education entry created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Education'
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
import { createEducationSchema } from '@/lib/validations/candidate'
import { getCandidateById, createEducation } from '@/lib/services/candidate'
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
    const parsed = createEducationSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const educationEntry = await createEducation(candidateId, parsed.data)
    return created(educationEntry)
  })
}
