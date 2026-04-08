'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor(ms / 3600000)

  if (hours > 0) {
    return [
      String(hours).padStart(2, '0'),
      String(minutes).padStart(2, '0'),
      String(seconds).padStart(2, '0'),
    ].join(':') + `.${String(centiseconds).padStart(2, '0')}`
  }

  return [
    String(minutes).padStart(2, '0'),
    String(seconds).padStart(2, '0'),
  ].join(':') + `.${String(centiseconds).padStart(2, '0')}`
}

export function Stopwatch() {
  const [elapsed, setElapsed] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [laps, setLaps] = useState<Lap[]>([])

  const startTimeRef = useRef<number | null>(null)
  const accumulatedRef = useRef(0)
  const rafRef = useRef<number | null>(null)

  const tick = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsed(accumulatedRef.current + (Date.now() - startTimeRef.current))
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [])

  const handleStartPause = useCallback(() => {
    if (isRunning) {
      // Pause
      if (startTimeRef.current !== null) {
        accumulatedRef.current += Date.now() - startTimeRef.current
        startTimeRef.current = null
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      setIsRunning(false)
    } else {
      // Start / Resume
      startTimeRef.current = Date.now()
      setIsRunning(true)
      rafRef.current = requestAnimationFrame(tick)
    }
  }, [isRunning, tick])

  const handleReset = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    startTimeRef.current = null
    accumulatedRef.current = 0
    setElapsed(0)
    setIsRunning(false)
    setLaps([])
  }, [])

  const handleLap = useCallback(() => {
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
  }, [isRunning, elapsed])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  const bestLap = laps.length > 1 ? Math.min(...laps.map((l: Lap) => l.delta)) : null
  const worstLap = laps.length > 1 ? Math.max(...laps.map((l: Lap) => l.delta)) : null

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-md mx-auto">
      {/* Display */}
      <Card className="w-full">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-muted-foreground text-sm font-medium uppercase tracking-widest">
            Cronómetro
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-6 pb-8">
          {/* Time display */}
          <div
            className={cn(
              'font-mono text-6xl font-bold tabular-nums tracking-tight transition-colors duration-300',
              isRunning ? 'text-primary' : elapsed > 0 ? 'text-foreground' : 'text-muted-foreground'
            )}
            aria-live="polite"
            aria-label={`Tiempo transcurrido: ${formatTime(elapsed)}`}
          >
            {formatTime(elapsed)}
          </div>

          {/* Controls */}
          <div className="flex gap-3 w-full justify-center">
            <Button
              variant="outline"
              size="lg"
              onClick={isRunning ? handleLap : handleReset}
              disabled={!isRunning && elapsed === 0}
              className="w-28"
            >
              {isRunning ? 'Vuelta' : 'Reiniciar'}
            </Button>

            <Button
              size="lg"
              onClick={handleStartPause}
              className={cn(
                'w-28 transition-colors',
                isRunning
                  ? 'bg-destructive hover:bg-destructive/90 text-destructive-foreground'
                  : 'bg-primary hover:bg-primary/90 text-primary-foreground'
              )}
            >
              {isRunning ? 'Pausar' : elapsed > 0 ? 'Reanudar' : 'Iniciar'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Laps */}
      {laps.length > 0 && (
        <Card className="w-full">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
              Vueltas
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ul className="divide-y divide-border max-h-64 overflow-y-auto">
              {[...laps].reverse().map((lap) => {
                const isBest = bestLap !== null && lap.delta === bestLap
                const isWorst = worstLap !== null && lap.delta === worstLap

                return (
                  <li
                    key={lap.id}
                    className={cn(
                      'flex items-center justify-between px-6 py-3 text-sm',
                      isBest && 'text-green-600 dark:text-green-400',
                      isWorst && 'text-destructive'
                    )}
                  >
                    <span className="font-medium">Vuelta {lap.id}</span>
                    <div className="flex gap-6 font-mono">
                      <span className="text-muted-foreground">
                        +{formatTime(lap.delta)}
                      </span>
                      <span className="font-semibold">{formatTime(lap.time)}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
