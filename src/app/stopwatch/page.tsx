import { Stopwatch } from '@/components/stopwatch/stopwatch'

export const metadata = {
  title: 'Stopwatch',
  description: 'A simple stopwatch with lap tracking',
}

export default function StopwatchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-center mb-8">
          Stopwatch
        </h1>
        <Stopwatch />
      </div>
    </div>
  )
}
