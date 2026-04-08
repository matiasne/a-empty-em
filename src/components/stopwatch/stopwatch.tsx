'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface Lap {
  id: number
  time: number
  delta: number
}

function formatTime(ms: number): string {
  const centiseconds = Math.floor((ms % 1000) / 10)
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60_000) % 60)
  const hours = Math.floor(ms / 3_600_000)

  if (hours > 0) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
  }
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}.${String(centiseconds).padStart(2, '0')}`
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState<number>(0)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [laps, setLaps] = useState<Lap[]>([])

  // Refs to keep track of timing without causing re-renders
  const startTimeRef = useRef<number>(0)
  const accumulatedRef = useRef<number>(0)
  const frameRef = useRef<number>(0)

  // Use a ref for the rAF loop to avoid circular useCallback dependencies
  const tickRef = useRef<() => void>(() => undefined)
  tickRef.current = () => {
    setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current))
    frameRef.current = requestAnimationFrame(tickRef.current)
  }

  useEffect(() => {
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  const handleStartPause = () => {
    if (isRunning) {
      // Pause: save accumulated time and stop the loop
      accumulatedRef.current += Date.now() - startTimeRef.current
      cancelAnimationFrame(frameRef.current)
    } else {
      // Start / Resume: record the start timestamp and kick off the loop
      startTimeRef.current = Date.now()
      frameRef.current = requestAnimationFrame(tickRef.current)
    }
    setIsRunning((prev: boolean) => !prev)
  }

  const handleReset = () => {
    cancelAnimationFrame(frameRef.current)
    accumulatedRef.current = 0
    setElapsed(0)
    setIsRunning(false)
    setLaps([])
  }

  const handleLap = () => {
    if (!isRunning) return
    setLaps((prev: Lap[]) => {
      const lastLapTime = prev.length > 0 ? prev[prev.length - 1].time : 0
      return [
        ...prev,
        {
          id: prev.length + 1,
          time: elapsed,
          delta: elapsed - lastLapTime,
        },
      ]
    })
  }

  // Highlight best (green) and worst (red) split times when there are 2+ laps
  const lapDeltas = laps.map((l: Lap) => l.delta)
  const bestDelta: number | null = lapDeltas.length > 1 ? Math.min(...lapDeltas) : null
  const worstDelta: number | null = lapDeltas.length > 1 ? Math.max(...lapDeltas) : null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Main display card */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Stopwatch
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {/* Time display */}
          <div
            className={cn(
              'font-mono font-bold tabular-nums text-5xl transition-colors select-none',
              elapsed === 0 && !isRunning ? 'text-muted-foreground' : 'text-foreground'
            )}
            aria-live="polite"
            aria-label={`Elapsed time: ${formatTime(elapsed)}`}
          >
            {formatTime(elapsed)}
          </div>

          {/* Control buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleLap}
              disabled={!isRunning}
              className="w-24"
            >
              Lap
            </Button>

            <Button
              size="lg"
              onClick={handleStartPause}
              className={cn(
                'w-24 text-white',
                isRunning
                  ? 'bg-yellow-500 hover:bg-yellow-600'
                  : 'bg-green-600 hover:bg-green-700'
              )}
            >
              {isRunning ? 'Pause' : elapsed === 0 ? 'Start' : 'Resume'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={handleReset}
              disabled={elapsed === 0 && !isRunning}
              className="w-24"
            >
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lap list — only shown once at least one lap is recorded */}
      {laps.length > 0 && (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Laps
            </CardTitle>
          </CardHeader>
          <CardContent className="px-0 pb-0">
            <div className="max-h-64 overflow-y-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="py-2 px-6 text-left font-medium">Lap</th>
                    <th className="py-2 px-6 text-right font-medium">Split</th>
                    <th className="py-2 px-6 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...laps].reverse().map((lap: Lap) => (
                    <tr
                      key={lap.id}
                      className={cn(
                        'border-b last:border-0 transition-colors',
                        lap.delta === bestDelta &&
                          'text-green-600 bg-green-50 dark:bg-green-950/20',
                        lap.delta === worstDelta &&
                          'text-red-500 bg-red-50 dark:bg-red-950/20'
                      )}
                    >
                      <td className="py-2 px-6 font-medium">#{lap.id}</td>
                      <td className="py-2 px-6 text-right font-mono tabular-nums">
                        {formatTime(lap.delta)}
                      </td>
                      <td className="py-2 px-6 text-right font-mono tabular-nums text-muted-foreground">
                        {formatTime(lap.time)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
