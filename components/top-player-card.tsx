"use client"

import { Card, CardContent } from '@/components/ui/card'
import { PlayerAvatar } from './player-avatar'
import { cn } from '@/lib/utils'
import type { JugadorStats } from '@/lib/types'

interface TopPlayerCardProps {
  stats: JugadorStats
  rank: number
  statLabel: string
  statValue: string | number
  variant?: 'default' | 'gold'
}

export function TopPlayerCard({ 
  stats, 
  rank, 
  statLabel, 
  statValue,
  variant = 'default'
}: TopPlayerCardProps) {
  const { jugador } = stats
  const displayName = jugador.apodo || jugador.nombre

  return (
    <Card className={cn(
      "relative overflow-hidden",
      variant === 'gold' && "border-amber-500/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/20 dark:to-amber-900/10"
    )}>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
            rank === 1 && "bg-amber-500 text-white",
            rank === 2 && "bg-zinc-400 text-white",
            rank === 3 && "bg-amber-700 text-white"
          )}>
            {rank}
          </div>
          <PlayerAvatar nombre={jugador.nombre} size="md" />
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{displayName}</p>
            <p className="text-xs text-muted-foreground truncate">{jugador.nombre}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">{statValue}</p>
            <p className="text-xs text-muted-foreground">{statLabel}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
