"use client"

import { useStore } from '@/lib/store'
import { calcularStatsGlobales, getPartidosConParticipaciones } from '@/lib/stats'
import { Navigation } from '@/components/navigation'
import { StatCard } from '@/components/stat-card'
import { TopPlayerCard } from '@/components/top-player-card'
import { MatchCard } from '@/components/match-card'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Target, TrendingUp, Award } from 'lucide-react'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts'

export default function DashboardPage() {
  const { jugadores, partidos, participaciones } = useStore()
  
  const stats = calcularStatsGlobales(jugadores, partidos, participaciones)
  const partidosConParticipaciones = getPartidosConParticipaciones(partidos, participaciones, jugadores)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    .slice(0, 5)

  const goleadoresData = stats.topGoleadores.map(s => ({
    name: s.jugador.apodo || s.jugador.nombre.split(' ')[0],
    goles: s.goles
  }))

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Estadísticas del año 2026</p>
          </div>

          {/* Global Stats */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            <StatCard
              title="Partidos Jugados"
              value={stats.totalPartidos}
              icon={Calendar}
            />
            <StatCard
              title="Goles Totales"
              value={stats.totalGoles}
              icon={Target}
            />
            <StatCard
              title="Promedio Goles/Partido"
              value={(stats.totalGoles / (stats.totalPartidos || 1)).toFixed(1)}
              icon={TrendingUp}
            />
            <StatCard
              title="Jugadores Activos"
              value={jugadores.filter(j => j.activo).length}
              icon={Award}
            />
          </div>

          {/* Charts and Top Players */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Top Scorers Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Goleadores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={goleadoresData} layout="vertical">
                      <XAxis type="number" />
                      <YAxis dataKey="name" type="category" width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'var(--card)', 
                          border: '1px solid var(--border)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="goles" radius={[0, 4, 4, 0]}>
                        {goleadoresData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={index === 0 ? 'var(--chart-1)' : index === 1 ? 'var(--chart-2)' : 'var(--chart-3)'} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Top Win Rate */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Top Win Rate
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topWinRate.length > 0 ? (
                  stats.topWinRate.map((s, i) => (
                    <TopPlayerCard
                      key={s.jugador.id}
                      stats={s}
                      rank={i + 1}
                      statLabel="Win Rate"
                      statValue={`${s.winRate?.toFixed(0)}%`}
                    />
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Aún no hay suficientes datos
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* More Rankings */}
          <div className="grid gap-6 lg:grid-cols-2 mb-8">
            {/* Top Scorers List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Top Goleadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topGoleadores.map((s, i) => (
                  <TopPlayerCard
                    key={s.jugador.id}
                    stats={s}
                    rank={i + 1}
                    statLabel="Goles"
                    statValue={s.goles}
                  />
                ))}
              </CardContent>
            </Card>

            {/* Top Assists */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  Top Asistidores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {stats.topAsistidores.map((s, i) => (
                  <TopPlayerCard
                    key={s.jugador.id}
                    stats={s}
                    rank={i + 1}
                    statLabel="Asistencias"
                    statValue={s.asistencias}
                  />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Matches */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Últimos Partidos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {partidosConParticipaciones.map(partido => (
                <MatchCard key={partido.id} partido={partido} compact />
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
