import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import type { ApiResponse } from '@/types'

// ─── Success helpers ─────────────────────────────────────────────────────────

export function ok<T>(data: T, status = 200): NextResponse<ApiResponse<T>> {
  return NextResponse.json({ data }, { status })
}

export function created<T>(data: T): NextResponse<ApiResponse<T>> {
  return ok(data, 201)
}

export function noContent(): NextResponse {
  return new NextResponse(null, { status: 204 })
}

// ─── Error helpers ───────────────────────────────────────────────────────────

export function badRequest(message: string): NextResponse<ApiResponse> {
  return NextResponse.json({ error: message }, { status: 400 })
}

export function notFound(resource = 'Resource'): NextResponse<ApiResponse> {
  return NextResponse.json(
    { error: `${resource} not found` },
    { status: 404 }
  )
}

export function conflict(message: string): NextResponse<ApiResponse> {
  return NextResponse.json({ error: message }, { status: 409 })
}

export function internalError(message = 'Internal server error'): NextResponse<ApiResponse> {
  return NextResponse.json({ error: message }, { status: 500 })
}

// ─── Validation helper ───────────────────────────────────────────────────────

/**
 * Formats a ZodError into a structured 422 response.
 */
export function validationError(error: ZodError): NextResponse<ApiResponse> {
  const errors = error.errors.map((e) => ({
    field: e.path.join('.'),
    message: e.message,
  }))
  return NextResponse.json({ error: 'Validation failed', errors }, { status: 422 })
}

// ─── Route handler wrapper ───────────────────────────────────────────────────

/**
 * Wraps an async route handler and converts known error types to appropriate
 * HTTP responses, preventing unhandled exceptions from leaking details.
 */
export async function handleRoute(
  handler: () => Promise<NextResponse>
): Promise<NextResponse> {
  try {
    return await handler()
  } catch (error) {
    if (error instanceof ZodError) {
      return validationError(error)
    }
    // Detect unique constraint violations from postgres driver
    if (
      error instanceof Error &&
      error.message.toLowerCase().includes('unique')
    ) {
      return conflict('A record with that value already exists')
    }
    console.error('[API Error]', error)
    return internalError()
  }
}

// ─── Param parsing helpers ────────────────────────────────────────────────────

/**
 * Parses a route segment as a positive integer.
 * Returns null when the value is not a valid id.
 */
export function parseId(value: string): number | null {
  const id = Number(value)
  return Number.isInteger(id) && id > 0 ? id : null
}
