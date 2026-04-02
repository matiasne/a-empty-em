import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { createUserSchema } from '@/lib/validations/user'

export async function GET() {
  try {
    const allUsers = await db.select().from(users)
    return NextResponse.json(allUsers)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = createUserSchema.parse(body)
    
    const newUser = await db
      .insert(users)
      .values({
        name: validatedData.name,
        email: validatedData.email,
      })
      .returning()
    
    return NextResponse.json(newUser[0], { status: 201 })
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    )
  }
}