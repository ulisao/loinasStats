"use client"

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { calcularStatsJugador } from '@/lib/stats'
import { Navigation } from '@/components/navigation'
import { PlayerAvatar } from '@/components/player-avatar'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default function JugadoresPage() {
  const { jugadores, partidos, participaciones } = useStore()
  
  const jugadoresActivos = jugadores.filter(j => j.activo)
  const jugadoresConStats = jugadoresActivos.map(j => ({
    jugador: j,
    stats: calcularStatsJugador(j, partidos, participaciones)
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Jugadores</h1>
            <p className="text-muted-foreground mt-1">{jugadoresActivos.length} jugadores activos</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {jugadoresConStats.map(({ jugador, stats }) => (
              <Link key={jugador.id} href={`/jugadores/${jugador.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center">
                      <PlayerAvatar nombre={jugador.nombre} size="xl" />
                      <h3 className="mt-4 font-semibold text-lg">
                        {jugador.apodo || jugador.nombre}
                      </h3>
                      {jugador.apodo && (
                        <p className="text-sm text-muted-foreground">{jugador.nombre}</p>
                      )}
                      
                      <div className="mt-4 flex gap-2">
                        <Badge variant="secondary">
                          {stats.goles} goles
                        </Badge>
                        <Badge variant="secondary">
                          {stats.asistencias} asist.
                        </Badge>
                      </div>
                      
                      <div className="mt-3 text-sm text-muted-foreground">
                        {stats.cumpleUmbral ? (
                          <span className="font-medium text-primary">
                            {stats.winRate?.toFixed(0)}% Win Rate
                          </span>
                        ) : (
                          <span>Pocos partidos</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
