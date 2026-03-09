"use client"

import { useParams, useRouter } from 'next/navigation'
import { useStore } from '@/lib/store'
import { calcularStatsJugador, getHistorialPartidosJugador } from '@/lib/stats'
import { Navigation } from '@/components/navigation'
import { PlayerAvatar } from '@/components/player-avatar'
import { StatCard } from '@/components/stat-card'
import { MatchCard } from '@/components/match-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Target, HandHelping, Trophy, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react'

export default function JugadorDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { jugadores, partidos, participaciones } = useStore()
  
  const jugador = jugadores.find(j => j.id === params.id)
  
  if (!jugador) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="lg:ml-64 pb-20 lg:pb-8">
          <div className="p-4 lg:p-8">
            <p className="text-muted-foreground">Jugador no encontrado</p>
          </div>
        </main>
      </div>
    )
  }
  
  const stats = calcularStatsJugador(jugador, partidos, participaciones)
  const historial = getHistorialPartidosJugador(jugador.id, partidos, participaciones, jugadores)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>

          {/* Player Header */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-8">
            <PlayerAvatar nombre={jugador.nombre} size="xl" className="h-24 w-24 text-2xl" />
            <div className="text-center sm:text-left">
              <h1 className="text-3xl font-bold">{jugador.apodo || jugador.nombre}</h1>
              {jugador.apodo && (
                <p className="text-lg text-muted-foreground">{jugador.nombre}</p>
              )}
              <div className="mt-2">
                {stats.cumpleUmbral ? (
                  <span className="text-2xl font-bold text-primary">
                    {stats.winRate?.toFixed(1)}% Win Rate
                  </span>
                ) : (
                  <span className="text-lg text-muted-foreground">
                    Pocos partidos para calcular Win Rate
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 mb-8">
            <StatCard
              title="Partidos"
              value={stats.partidosJugados}
              icon={Calendar}
            />
            <StatCard
              title="Ganados"
              value={stats.partidosGanados}
              icon={Trophy}
              className="border-primary/20"
            />
            <StatCard
              title="Empatados"
              value={stats.partidosEmpatados}
              icon={Minus}
            />
            <StatCard
              title="Perdidos"
              value={stats.partidosPerdidos}
              icon={TrendingDown}
            />
            <StatCard
              title="Goles"
              value={stats.goles}
              icon={Target}
            />
            <StatCard
              title="Asistencias"
              value={stats.asistencias}
              icon={HandHelping}
            />
          </div>

          {/* Record Summary */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Resumen de Temporada
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8 py-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{stats.partidosGanados}</div>
                  <div className="text-sm text-muted-foreground">Victorias</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-muted-foreground">{stats.partidosEmpatados}</div>
                  <div className="text-sm text-muted-foreground">Empates</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-destructive">{stats.partidosPerdidos}</div>
                  <div className="text-sm text-muted-foreground">Derrotas</div>
                </div>
              </div>
              
              {/* Win Rate Progress Bar */}
              {stats.cumpleUmbral && stats.winRate !== null && (
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Win Rate</span>
                    <span className="font-medium">{stats.winRate.toFixed(1)}%</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${stats.winRate}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Match History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Historial de Partidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {historial.length > 0 ? (
                historial.map(partido => {
                  const participacion = partido.participaciones.find(p => p.jugador_id === jugador.id)
                  const resultado = partido.resultado_equipo_a === partido.resultado_equipo_b
                    ? 'empate'
                    : (participacion?.equipo === 'A' && partido.resultado_equipo_a > partido.resultado_equipo_b) ||
                      (participacion?.equipo === 'B' && partido.resultado_equipo_b > partido.resultado_equipo_a)
                    ? 'victoria'
                    : 'derrota'
                  
                  return (
                    <div key={partido.id} className="relative">
                      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-full ${
                        resultado === 'victoria' ? 'bg-primary' : 
                        resultado === 'empate' ? 'bg-muted-foreground' : 'bg-destructive'
                      }`} />
                      <div className="pl-4">
                        <MatchCard partido={partido} compact />
                        {participacion && (participacion.goles > 0 || participacion.asistencias > 0) && (
                          <div className="mt-2 flex gap-3 text-sm text-muted-foreground">
                            {participacion.goles > 0 && (
                              <span className="flex items-center gap-1">
                                <Target className="h-4 w-4" />
                                {participacion.goles} {participacion.goles === 1 ? 'gol' : 'goles'}
                              </span>
                            )}
                            {participacion.asistencias > 0 && (
                              <span className="flex items-center gap-1">
                                <HandHelping className="h-4 w-4" />
                                {participacion.asistencias} {participacion.asistencias === 1 ? 'asistencia' : 'asistencias'}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Este jugador aún no ha participado en partidos
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
