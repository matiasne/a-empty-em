import { Suspense } from 'react'
import { UsersList } from '@/components/users/users-list'
import { AddUserForm } from '@/components/users/add-user-form'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Users</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New User</CardTitle>
            </CardHeader>
            <CardContent>
              <AddUserForm />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Users List</CardTitle>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<div>Loading users...</div>}>
                <UsersList />
              </Suspense>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}