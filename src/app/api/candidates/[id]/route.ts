/**
 * @openapi
 * /api/candidates/{id}:
 *   get:
 *     summary: Get a candidate
 *     description: Returns a single candidate profile including work experience, education, and skills.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *     responses:
 *       200:
 *         description: The candidate profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/CandidateWithRelations'
 *       400:
 *         description: Invalid candidate id.
 *       404:
 *         description: Candidate not found.
 *       500:
 *         description: Internal server error.
 *   put:
 *     summary: Update a candidate
 *     description: Updates an existing candidate profile.
 *     tags:
 *       - Candidates
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
 *             $ref: '#/components/schemas/UpdateCandidateInput'
 *     responses:
 *       200:
 *         description: Updated candidate profile.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       400:
 *         description: Invalid candidate id.
 *       404:
 *         description: Candidate not found.
 *       409:
 *         description: Email address is already in use.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 *   delete:
 *     summary: Delete a candidate
 *     description: Permanently removes a candidate profile and all related data.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Candidate id.
 *     responses:
 *       204:
 *         description: Candidate deleted successfully.
 *       400:
 *         description: Invalid candidate id.
 *       404:
 *         description: Candidate not found.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { updateCandidateSchema } from '@/lib/validations/candidate'
import {
  getCandidateById,
  updateCandidate,
  deleteCandidate,
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

type RouteContext = { params: { id: string } }

export async function GET(_request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const id = parseId(params.id)
    if (id === null) return badRequest('Invalid candidate id')

    const candidate = await getCandidateById(id)
    if (!candidate) return notFound('Candidate')

    return ok(candidate)
  })
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const id = parseId(params.id)
    if (id === null) return badRequest('Invalid candidate id')

    const body = await request.json()
    const parsed = updateCandidateSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const candidate = await updateCandidate(id, parsed.data)
    if (!candidate) return notFound('Candidate')

    return ok(candidate)
  })
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  return handleRoute(async () => {
    const id = parseId(params.id)
    if (id === null) return badRequest('Invalid candidate id')

    const deleted = await deleteCandidate(id)
    if (!deleted) return notFound('Candidate')

    return noContent()
  })
}
