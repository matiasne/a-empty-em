import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header / Nav */}
      <header className="border-b bg-background">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-foreground">
              Test App
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <Link
              href="/users"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Users
            </Link>
            <Button asChild size="sm">
              <Link href="/api/health">API Health</Link>
            </Button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b bg-muted/40">
          <div className="container mx-auto px-4 py-20 text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground mb-4">
              Welcome to Test
            </h1>
            <p className="mx-auto max-w-xl text-xl text-muted-foreground mb-8">
              A modern full-stack application built with Next.js 14, TypeScript,
              and PostgreSQL.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/users">Get Started</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/api/health">Check API Health</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-16">
          <h2 className="mb-8 text-center text-3xl font-semibold tracking-tight">
            What&apos;s Inside
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Next.js 14</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Built with the latest Next.js App Router and React Server
                  Components for fast, scalable pages.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>TypeScript</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Full TypeScript support with strict type checking for safer,
                  more maintainable code.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>PostgreSQL</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Powerful database integration via Drizzle ORM for type-safe,
                  efficient queries.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Getting Started */}
        <section className="container mx-auto px-4 pb-16">
          <div className="rounded-lg bg-muted p-8">
            <h2 className="mb-4 text-2xl font-semibold">Getting Started</h2>
            <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
              <li>
                Copy{' '}
                <code className="rounded bg-background px-2 py-0.5">
                  .env.example
                </code>{' '}
                to{' '}
                <code className="rounded bg-background px-2 py-0.5">
                  .env.local
                </code>
              </li>
              <li>Update your database connection string</li>
              <li>
                Run{' '}
                <code className="rounded bg-background px-2 py-0.5">
                  npm run db:migrate
                </code>{' '}
                to set up the database
              </li>
              <li>
                Start developing with{' '}
                <code className="rounded bg-background px-2 py-0.5">
                  npm run dev
                </code>
              </li>
            </ol>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 text-sm text-muted-foreground">
          <span>© {new Date().getFullYear()} Test App</span>
          <div className="flex gap-4">
            <Link href="/users" className="hover:text-foreground transition-colors">
              Users
            </Link>
            <Link href="/api/health" className="hover:text-foreground transition-colors">
              API
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
