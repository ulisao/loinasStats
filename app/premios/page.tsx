"use client"

import { useEffect, useState, useCallback } from 'react'
import { useStore } from '@/lib/store'
import { calcularStatsGlobales } from '@/lib/stats'
import { Navigation } from '@/components/navigation'
import { PlayerAvatar } from '@/components/player-avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Trophy, Medal, Skull, Check, Crown } from 'lucide-react'
import confetti from 'canvas-confetti'

function getOrCreateVoterToken(): string {
  if (typeof window === 'undefined') return ''
  
  let token = localStorage.getItem('voter_token')
  if (!token) {
    token = crypto.randomUUID()
    localStorage.setItem('voter_token', token)
  }
  return token
}

export default function PremiosPage() {
  const { 
    jugadores, 
    partidos, 
    participaciones, 
    premios, 
    nominaciones, 
    votos,
    isAdmin,
    addVoto,
    hasVoted,
    cerrarPremio
  } = useStore()
  
  const [voterToken, setVoterToken] = useState('')
  const [showingWinner, setShowingWinner] = useState<string | null>(null)
  
  useEffect(() => {
    setVoterToken(getOrCreateVoterToken())
  }, [])
  
  const stats = calcularStatsGlobales(jugadores, partidos, participaciones)
  
  // Get best and worst players by win rate
  const mejorJugador = stats.topWinRate[0]
  const peorJugador = stats.peorWinRate[0]
  const candidatosMejor = stats.topWinRate.slice(0, 3)
  const candidatosPeor = stats.peorWinRate.slice(0, 3)

  const triggerConfetti = useCallback(() => {
    const duration = 3000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 }

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#ca8a04', '#eab308', '#fde047']
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#ca8a04', '#eab308', '#fde047']
      })
    }, 250)
  }, [])

  const handleVote = (premioId: string, jugadorId: string) => {
    if (!voterToken) return
    if (hasVoted(premioId, voterToken)) return
    
    addVoto(premioId, jugadorId, voterToken)
  }

  const handleDeclareWinner = (premioId: string, jugadorId: string) => {
    cerrarPremio(premioId, jugadorId)
    setShowingWinner(premioId)
    triggerConfetti()
    
    setTimeout(() => setShowingWinner(null), 5000)
  }

  const getVotosForPremio = (premioId: string) => {
    return votos.filter(v => v.premio_id === premioId)
  }

  const getVotosForNominado = (premioId: string, jugadorId: string) => {
    return votos.filter(v => v.premio_id === premioId && v.jugador_nominado_id === jugadorId).length
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/20 mb-4">
              <Trophy className="h-8 w-8 text-amber-500" />
            </div>
            <h1 className="text-4xl font-bold text-white text-balance">Premios 2026</h1>
            <p className="text-zinc-400 mt-2">Ceremonia de premiacion</p>
          </div>

          {/* Automatic Awards */}
          <div className="grid gap-6 lg:grid-cols-2 mb-12">
            {/* Best Player */}
            <Card className="bg-gradient-to-br from-amber-950/50 to-zinc-900 border-amber-500/30">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Medal className="h-6 w-6 text-amber-500" />
                  <CardTitle className="text-amber-500">Jugador del Ano</CardTitle>
                </div>
                <CardDescription className="text-zinc-400">
                  Mayor win rate (minimo 30% de partidos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {mejorJugador ? (
                  <div className="space-y-4">
                    {/* Winner */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                      <div className="relative">
                        <PlayerAvatar nombre={mejorJugador.jugador.nombre} size="xl" />
                        <Crown className="absolute -top-2 -right-2 h-6 w-6 text-amber-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xl font-bold text-white">
                          {mejorJugador.jugador.apodo || mejorJugador.jugador.nombre}
                        </p>
                        <p className="text-zinc-400">{mejorJugador.jugador.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-amber-500">
                          {mejorJugador.winRate?.toFixed(0)}%
                        </p>
                        <p className="text-sm text-zinc-400">Win Rate</p>
                      </div>
                    </div>
                    
                    {/* Candidates */}
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-500 font-medium">Terna</p>
                      {candidatosMejor.map((c, i) => (
                        <div 
                          key={c.jugador.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50"
                        >
                          <span className="w-6 text-center text-amber-500 font-bold">{i + 1}</span>
                          <PlayerAvatar nombre={c.jugador.nombre} size="sm" />
                          <span className="flex-1 text-zinc-300">
                            {c.jugador.apodo || c.jugador.nombre}
                          </span>
                          <span className="text-zinc-400">{c.winRate?.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-8">
                    No hay suficientes datos para determinar el ganador
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Worst Player */}
            <Card className="bg-gradient-to-br from-zinc-800 to-zinc-900 border-zinc-700">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Skull className="h-6 w-6 text-zinc-400" />
                  <CardTitle className="text-zinc-300">Peor Jugador</CardTitle>
                </div>
                <CardDescription className="text-zinc-500">
                  Menor win rate (minimo 30% de partidos)
                </CardDescription>
              </CardHeader>
              <CardContent>
                {peorJugador ? (
                  <div className="space-y-4">
                    {/* Winner */}
                    <div className="flex items-center gap-4 p-4 rounded-lg bg-zinc-800 border border-zinc-700">
                      <PlayerAvatar nombre={peorJugador.jugador.nombre} size="xl" />
                      <div className="flex-1">
                        <p className="text-xl font-bold text-zinc-200">
                          {peorJugador.jugador.apodo || peorJugador.jugador.nombre}
                        </p>
                        <p className="text-zinc-500">{peorJugador.jugador.nombre}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-zinc-400">
                          {peorJugador.winRate?.toFixed(0)}%
                        </p>
                        <p className="text-sm text-zinc-500">Win Rate</p>
                      </div>
                    </div>
                    
                    {/* Candidates */}
                    <div className="space-y-2">
                      <p className="text-sm text-zinc-600 font-medium">Terna</p>
                      {candidatosPeor.map((c, i) => (
                        <div 
                          key={c.jugador.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-zinc-800/50"
                        >
                          <span className="w-6 text-center text-zinc-500 font-bold">{i + 1}</span>
                          <PlayerAvatar nombre={c.jugador.nombre} size="sm" />
                          <span className="flex-1 text-zinc-400">
                            {c.jugador.apodo || c.jugador.nombre}
                          </span>
                          <span className="text-zinc-500">{c.winRate?.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-zinc-500 text-center py-8">
                    No hay suficientes datos para determinar el ganador
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Voting Awards */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Premios por Votacion
            </h2>
            
            <div className="grid gap-6 lg:grid-cols-2">
              {premios.map(premio => {
                const nominadosIds = nominaciones
                  .filter(n => n.premio_id === premio.id)
                  .map(n => n.jugador_id)
                const nominadosJugadores = jugadores.filter(j => nominadosIds.includes(j.id))
                const totalVotos = getVotosForPremio(premio.id).length
                const yaVoto = voterToken && hasVoted(premio.id, voterToken)
                const ganador = premio.ganador_id 
                  ? jugadores.find(j => j.id === premio.ganador_id)
                  : null
                const isShowingWinner = showingWinner === premio.id

                return (
                  <Card 
                    key={premio.id}
                    className={`bg-gradient-to-br border transition-all duration-500 ${
                      premio.cerrado 
                        ? 'from-amber-950/50 to-zinc-900 border-amber-500/50'
                        : 'from-zinc-800 to-zinc-900 border-zinc-700'
                    } ${isShowingWinner ? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-zinc-900' : ''}`}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-white">{premio.nombre_terna}</CardTitle>
                        {premio.cerrado && (
                          <Badge className="bg-amber-500 text-zinc-900">Cerrado</Badge>
                        )}
                      </div>
                      <CardDescription className="text-zinc-400">
                        {premio.descripcion}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Show winner if closed */}
                      {ganador && (
                        <div className={`flex items-center gap-4 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 ${
                          isShowingWinner ? 'animate-pulse' : ''
                        }`}>
                          <div className="relative">
                            <PlayerAvatar nombre={ganador.nombre} size="lg" />
                            <Crown className="absolute -top-2 -right-2 h-5 w-5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-sm text-amber-500 font-medium">Ganador</p>
                            <p className="text-lg font-bold text-white">
                              {ganador.apodo || ganador.nombre}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Nominees */}
                      <div className="space-y-2">
                        {nominadosJugadores.map(nominado => {
                          const votosNominado = getVotosForNominado(premio.id, nominado.id)
                          const porcentaje = totalVotos > 0 ? (votosNominado / totalVotos) * 100 : 0
                          const isGanador = premio.ganador_id === nominado.id

                          return (
                            <div 
                              key={nominado.id}
                              className={`relative p-3 rounded-lg ${
                                isGanador 
                                  ? 'bg-amber-500/20 border border-amber-500/50' 
                                  : 'bg-zinc-800/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <PlayerAvatar nombre={nominado.nombre} size="sm" />
                                <span className="flex-1 text-zinc-200">
                                  {nominado.apodo || nominado.nombre}
                                </span>
                                
                                {!premio.cerrado && !yaVoto && (
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleVote(premio.id, nominado.id)}
                                    className="bg-zinc-700 hover:bg-zinc-600 text-white"
                                  >
                                    Votar
                                  </Button>
                                )}
                                
                                {yaVoto && !premio.cerrado && (
                                  <Badge variant="secondary" className="bg-zinc-700">
                                    <Check className="h-3 w-3 mr-1" />
                                    Votaste
                                  </Badge>
                                )}
                                
                                {isAdmin && !premio.cerrado && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDeclareWinner(premio.id, nominado.id)}
                                    className="border-amber-500 text-amber-500 hover:bg-amber-500/10"
                                  >
                                    Declarar Ganador
                                  </Button>
                                )}
                                
                                <span className="text-sm text-zinc-400 w-16 text-right">
                                  {votosNominado} votos
                                </span>
                              </div>
                              
                              {/* Progress bar */}
                              <div className="mt-2 h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    isGanador ? 'bg-amber-500' : 'bg-zinc-500'
                                  }`}
                                  style={{ width: `${porcentaje}%` }}
                                />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      
                      {totalVotos > 0 && (
                        <p className="text-xs text-zinc-500 text-center">
                          {totalVotos} {totalVotos === 1 ? 'voto total' : 'votos totales'}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
            
            {premios.length === 0 && (
              <Card className="bg-zinc-800 border-zinc-700">
                <CardContent className="py-12 text-center">
                  <p className="text-zinc-500">No hay premios por votacion disponibles</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
