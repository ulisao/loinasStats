"use client"

import Link from 'next/link'
import { useStore } from '@/lib/store'
import { getPartidosConParticipaciones } from '@/lib/stats'
import { Navigation } from '@/components/navigation'
import { MatchCard } from '@/components/match-card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function PartidosPage() {
  const { jugadores, partidos, participaciones, isAdmin } = useStore()
  
  const partidosConParticipaciones = getPartidosConParticipaciones(partidos, participaciones, jugadores)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-balance">Partidos</h1>
              <p className="text-muted-foreground mt-1">{partidos.length} partidos jugados</p>
            </div>
            
            {isAdmin && (
              <Link href="/admin?tab=partidos">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Cargar Partido
                </Button>
              </Link>
            )}
          </div>

          <div className="space-y-4">
            {partidosConParticipaciones.map(partido => (
              <MatchCard key={partido.id} partido={partido} />
            ))}
            
            {partidosConParticipaciones.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No hay partidos registrados
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
