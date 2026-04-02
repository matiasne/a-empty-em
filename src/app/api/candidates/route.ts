/**
 * @openapi
 * /api/candidates:
 *   get:
 *     summary: List candidates
 *     description: Returns a paginated list of candidate profiles.
 *     tags:
 *       - Candidates
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number (1-based).
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page.
 *     responses:
 *       200:
 *         description: Paginated list of candidates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Candidate'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       422:
 *         description: Invalid query parameters.
 *       500:
 *         description: Internal server error.
 *   post:
 *     summary: Create a candidate
 *     description: Creates a new candidate profile.
 *     tags:
 *       - Candidates
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCandidateInput'
 *     responses:
 *       201:
 *         description: Candidate created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Candidate'
 *       409:
 *         description: Email address is already in use.
 *       422:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
import { type NextRequest } from 'next/server'
import { paginationSchema, createCandidateSchema } from '@/lib/validations/candidate'
import { getCandidates, createCandidate } from '@/lib/services/candidate'
import {
  ok,
  created,
  handleRoute,
  validationError,
} from '@/lib/api-response'

export async function GET(request: NextRequest) {
  return handleRoute(async () => {
    const { searchParams } = request.nextUrl

    const parsed = paginationSchema.safeParse({
      page: searchParams.get('page') ?? undefined,
      limit: searchParams.get('limit') ?? undefined,
    })

    if (!parsed.success) {
      return validationError(parsed.error)
    }

    const result = await getCandidates(parsed.data)
    return ok(result)
  })
}

export async function POST(request: NextRequest) {
  return handleRoute(async () => {
    const body = await request.json()

    const parsed = createCandidateSchema.safeParse(body)
    if (!parsed.success) {
      return validationError(parsed.error)
    }

    const candidate = await createCandidate(parsed.data)
    return created(candidate)
  })
}
