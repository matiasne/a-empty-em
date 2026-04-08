import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">
            Welcome to Test
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A modern Next.js application with TypeScript and PostgreSQL
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button asChild>
              <Link href="/api/health">Check API Health</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/users">View Users</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/stopwatch">⏱ Stopwatch</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Next.js 14</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Built with the latest Next.js App Router and React Server Components
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>TypeScript</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Full TypeScript support with strict type checking and IntelliSense
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>PostgreSQL</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Powerful database integration with Drizzle ORM for type-safe queries
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 p-6 bg-muted rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
          <div className="space-y-2 text-sm">
            <p>1. Copy <code className="bg-background px-2 py-1 rounded">.env.example</code> to <code className="bg-background px-2 py-1 rounded">.env.local</code></p>
            <p>2. Update your database connection string</p>
            <p>3. Run <code className="bg-background px-2 py-1 rounded">npm run db:migrate</code> to set up the database</p>
            <p>4. Start developing with <code className="bg-background px-2 py-1 rounded">npm run dev</code></p>
          </div>
        </div>
      </div>
    </div>
  )
}