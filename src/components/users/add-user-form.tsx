'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function AddUserForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [parentsAddressStreet, setParentsAddressStreet] = useState('')
  const [parentsAddressCity, setParentsAddressCity] = useState('')
  const [parentsAddressState, setParentsAddressState] = useState('')
  const [parentsAddressZip, setParentsAddressZip] = useState('')
  const [parentsAddressCountry, setParentsAddressCountry] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          parentsAddressStreet,
          parentsAddressCity,
          parentsAddressState,
          parentsAddressZip,
          parentsAddressCountry,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'User created successfully!' })
        setName('')
        setEmail('')
        setParentsAddressStreet('')
        setParentsAddressCity('')
        setParentsAddressState('')
        setParentsAddressZip('')
        setParentsAddressCountry('')
        window.location.reload()
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to create user' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred while creating the user' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ── Account details ── */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Enter user name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter user email"
        />
      </div>

      {/* ── Parent's address ── */}
      <div className="space-y-3 pt-2">
        <p className="text-sm font-semibold">Parent&apos;s Address</p>

        <div className="space-y-2">
          <Label htmlFor="parentsAddressStreet">Street Address</Label>
          <Input
            id="parentsAddressStreet"
            type="text"
            value={parentsAddressStreet}
            onChange={(e) => setParentsAddressStreet(e.target.value)}
            required
            placeholder="123 Main St"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="parentsAddressCity">City</Label>
            <Input
              id="parentsAddressCity"
              type="text"
              value={parentsAddressCity}
              onChange={(e) => setParentsAddressCity(e.target.value)}
              required
              placeholder="New York"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentsAddressState">State / Province</Label>
            <Input
              id="parentsAddressState"
              type="text"
              value={parentsAddressState}
              onChange={(e) => setParentsAddressState(e.target.value)}
              required
              placeholder="NY"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="parentsAddressZip">ZIP / Postal Code</Label>
            <Input
              id="parentsAddressZip"
              type="text"
              value={parentsAddressZip}
              onChange={(e) => setParentsAddressZip(e.target.value)}
              required
              placeholder="10001"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parentsAddressCountry">Country</Label>
            <Input
              id="parentsAddressCountry"
              type="text"
              value={parentsAddressCountry}
              onChange={(e) => setParentsAddressCountry(e.target.value)}
              required
              placeholder="United States"
            />
          </div>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Creating...' : 'Add User'}
      </Button>

      {message && (
        <div
          className={`text-sm p-2 rounded ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700 border border-green-300'
              : 'bg-red-100 text-red-700 border border-red-300'
          }`}
        >
          {message.text}
        </div>
      )}
    </form>
  )
}
