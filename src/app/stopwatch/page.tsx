import { Stopwatch } from '@/components/stopwatch/stopwatch'

export const metadata = {
  title: 'Cronómetro',
  description: 'Cronómetro con vueltas',
}

export default function StopwatchPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <Stopwatch />
    </div>
  )
}
