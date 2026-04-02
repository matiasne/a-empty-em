'use client'

import { useEffect, useState } from 'react'
import { User } from '@/db/schema'

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) {
          throw new Error('Failed to fetch users')
        }
        const data = await response.json()
        setUsers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return <div className="text-center py-4">Loading users...</div>
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-600">
        Error: {error}
      </div>
    )
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        No users found. Add one to get started!
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {users.map((user) => (
        <div
          key={user.id}
          className="p-4 rounded-lg border bg-card text-card-foreground"
        >
          <h3 className="font-semibold">{user.name}</h3>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground mt-1">
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  )
}