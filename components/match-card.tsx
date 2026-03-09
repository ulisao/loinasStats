"use client"

import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PlayerAvatar } from './player-avatar'
import { formatFecha } from '@/lib/stats'
import type { PartidoConParticipaciones } from '@/lib/types'

interface MatchCardProps {
  partido: PartidoConParticipaciones
  compact?: boolean
}

export function MatchCard({ partido, compact = false }: MatchCardProps) {
  const equipoA = partido.participaciones.filter(p => p.equipo === 'A')
  const equipoB = partido.participaciones.filter(p => p.equipo === 'B')
  
  const ganador = partido.resultado_equipo_a > partido.resultado_equipo_b 
    ? 'A' 
    : partido.resultado_equipo_b > partido.resultado_equipo_a 
      ? 'B' 
      : null

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              {formatFecha(partido.fecha)}
            </span>
            <Badge variant="secondary">{partido.formato}</Badge>
          </div>
          {partido.notas && !compact && (
            <span className="text-xs text-muted-foreground italic">{partido.notas}</span>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-center gap-4">
          {/* Equipo A */}
          <div className="flex-1 text-right">
            {!compact && (
              <div className="mb-2 flex flex-wrap justify-end gap-1">
                {equipoA.map(p => (
                  <div key={p.id} className="flex items-center gap-1 text-xs">
                    <PlayerAvatar nombre={p.jugador.nombre} size="sm" />
                    <span className="hidden sm:inline">{p.jugador.apodo || p.jugador.nombre.split(' ')[0]}</span>
                    {(p.goles > 0 || p.asistencias > 0) && (
                      <span className="text-muted-foreground">
                        {p.goles > 0 && `${p.goles}G`}
                        {p.goles > 0 && p.asistencias > 0 && ' '}
                        {p.asistencias > 0 && `${p.asistencias}A`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
            <span className={`text-lg font-medium ${ganador === 'A' ? 'text-primary' : ''}`}>
              Equipo A
            </span>
          </div>
          
          {/* Score */}
          <div className="flex items-center gap-2 px-4">
            <span className={`text-3xl font-bold ${ganador === 'A' ? 'text-primary' : ''}`}>
              {partido.resultado_equipo_a}
            </span>
            <span className="text-xl text-muted-foreground">-</span>
            <span className={`text-3xl font-bold ${ganador === 'B' ? 'text-primary' : ''}`}>
              {partido.resultado_equipo_b}
            </span>
          </div>
          
          {/* Equipo B */}
          <div className="flex-1 text-left">
            <span className={`text-lg font-medium ${ganador === 'B' ? 'text-primary' : ''}`}>
              Equipo B
            </span>
            {!compact && (
              <div className="mt-2 flex flex-wrap gap-1">
                {equipoB.map(p => (
                  <div key={p.id} className="flex items-center gap-1 text-xs">
                    <PlayerAvatar nombre={p.jugador.nombre} size="sm" />
                    <span className="hidden sm:inline">{p.jugador.apodo || p.jugador.nombre.split(' ')[0]}</span>
                    {(p.goles > 0 || p.asistencias > 0) && (
                      <span className="text-muted-foreground">
                        {p.goles > 0 && `${p.goles}G`}
                        {p.goles > 0 && p.asistencias > 0 && ' '}
                        {p.asistencias > 0 && `${p.asistencias}A`}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
