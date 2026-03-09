"use client"

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Jugador, Partido, Participacion, Premio, Voto, Nominacion } from './types'

// Mock data for demonstration
const mockJugadores: Jugador[] = [
  { id: '1', nombre: 'Carlos García', apodo: 'El Tanque', activo: true },
  { id: '2', nombre: 'Miguel Rodríguez', apodo: 'Migue', activo: true },
  { id: '3', nombre: 'Juan Pérez', apodo: null, activo: true },
  { id: '4', nombre: 'Luis Hernández', apodo: 'Lucho', activo: true },
  { id: '5', nombre: 'Andrés Martínez', apodo: 'El Loco', activo: true },
  { id: '6', nombre: 'Pedro Sánchez', apodo: 'Pedrito', activo: true },
  { id: '7', nombre: 'Roberto Díaz', apodo: 'Rober', activo: true },
  { id: '8', nombre: 'Fernando López', apodo: 'Fer', activo: true },
  { id: '9', nombre: 'Alejandro Torres', apodo: 'Alex', activo: true },
  { id: '10', nombre: 'Diego Ramírez', apodo: 'Dieguito', activo: true },
  { id: '11', nombre: 'Pablo Morales', apodo: null, activo: true },
  { id: '12', nombre: 'Sergio Castro', apodo: 'Sergi', activo: true },
]

const mockPartidos: Partido[] = [
  { id: '1', fecha: '2026-01-15', formato: '7v7', resultado_equipo_a: 3, resultado_equipo_b: 2, notas: 'Gran partido' },
  { id: '2', fecha: '2026-01-22', formato: '7v7', resultado_equipo_a: 1, resultado_equipo_b: 1, notas: null },
  { id: '3', fecha: '2026-01-29', formato: '5v5', resultado_equipo_a: 4, resultado_equipo_b: 3, notas: 'Muy reñido' },
  { id: '4', fecha: '2026-02-05', formato: '7v7', resultado_equipo_a: 2, resultado_equipo_b: 4, notas: null },
  { id: '5', fecha: '2026-02-12', formato: '7v7', resultado_equipo_a: 3, resultado_equipo_b: 3, notas: 'Empate épico' },
  { id: '6', fecha: '2026-02-19', formato: '5v5', resultado_equipo_a: 5, resultado_equipo_b: 2, notas: null },
  { id: '7', fecha: '2026-02-26', formato: '7v7', resultado_equipo_a: 1, resultado_equipo_b: 2, notas: null },
  { id: '8', fecha: '2026-03-05', formato: '7v7', resultado_equipo_a: 4, resultado_equipo_b: 1, notas: 'Victoria contundente' },
]

const mockParticipaciones: Participacion[] = [
  // Partido 1: Equipo A gana 3-2
  { id: 'p1-1', partido_id: '1', jugador_id: '1', equipo: 'A', goles: 2, asistencias: 0 },
  { id: 'p1-2', partido_id: '1', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p1-3', partido_id: '1', jugador_id: '3', equipo: 'A', goles: 0, asistencias: 2 },
  { id: 'p1-4', partido_id: '1', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p1-5', partido_id: '1', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p1-6', partido_id: '1', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p1-7', partido_id: '1', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p1-8', partido_id: '1', jugador_id: '8', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p1-9', partido_id: '1', jugador_id: '9', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p1-10', partido_id: '1', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p1-11', partido_id: '1', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p1-12', partido_id: '1', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 2: Empate 1-1
  { id: 'p2-1', partido_id: '2', jugador_id: '1', equipo: 'A', goles: 1, asistencias: 0 },
  { id: 'p2-2', partido_id: '2', jugador_id: '2', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p2-3', partido_id: '2', jugador_id: '3', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p2-4', partido_id: '2', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p2-5', partido_id: '2', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p2-6', partido_id: '2', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p2-7', partido_id: '2', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p2-8', partido_id: '2', jugador_id: '8', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p2-9', partido_id: '2', jugador_id: '9', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p2-10', partido_id: '2', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p2-11', partido_id: '2', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p2-12', partido_id: '2', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 3: Equipo A gana 4-3
  { id: 'p3-1', partido_id: '3', jugador_id: '1', equipo: 'A', goles: 2, asistencias: 1 },
  { id: 'p3-2', partido_id: '3', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p3-3', partido_id: '3', jugador_id: '3', equipo: 'A', goles: 1, asistencias: 0 },
  { id: 'p3-4', partido_id: '3', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p3-5', partido_id: '3', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p3-6', partido_id: '3', jugador_id: '6', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p3-7', partido_id: '3', jugador_id: '7', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p3-8', partido_id: '3', jugador_id: '8', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p3-9', partido_id: '3', jugador_id: '9', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p3-10', partido_id: '3', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 4: Equipo B gana 4-2
  { id: 'p4-1', partido_id: '4', jugador_id: '1', equipo: 'A', goles: 1, asistencias: 0 },
  { id: 'p4-2', partido_id: '4', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p4-3', partido_id: '4', jugador_id: '3', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p4-4', partido_id: '4', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p4-5', partido_id: '4', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p4-6', partido_id: '4', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p4-7', partido_id: '4', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p4-8', partido_id: '4', jugador_id: '8', equipo: 'B', goles: 2, asistencias: 0 },
  { id: 'p4-9', partido_id: '4', jugador_id: '9', equipo: 'B', goles: 1, asistencias: 2 },
  { id: 'p4-10', partido_id: '4', jugador_id: '10', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p4-11', partido_id: '4', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p4-12', partido_id: '4', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 5: Empate 3-3
  { id: 'p5-1', partido_id: '5', jugador_id: '1', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p5-2', partido_id: '5', jugador_id: '2', equipo: 'A', goles: 2, asistencias: 0 },
  { id: 'p5-3', partido_id: '5', jugador_id: '3', equipo: 'A', goles: 0, asistencias: 2 },
  { id: 'p5-4', partido_id: '5', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p5-5', partido_id: '5', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p5-6', partido_id: '5', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p5-7', partido_id: '5', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p5-8', partido_id: '5', jugador_id: '8', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p5-9', partido_id: '5', jugador_id: '9', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p5-10', partido_id: '5', jugador_id: '10', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p5-11', partido_id: '5', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p5-12', partido_id: '5', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 6: Equipo A gana 5-2
  { id: 'p6-1', partido_id: '6', jugador_id: '1', equipo: 'A', goles: 3, asistencias: 0 },
  { id: 'p6-2', partido_id: '6', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 2 },
  { id: 'p6-3', partido_id: '6', jugador_id: '3', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p6-4', partido_id: '6', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 2 },
  { id: 'p6-5', partido_id: '6', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p6-6', partido_id: '6', jugador_id: '6', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p6-7', partido_id: '6', jugador_id: '7', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p6-8', partido_id: '6', jugador_id: '8', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p6-9', partido_id: '6', jugador_id: '9', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p6-10', partido_id: '6', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 7: Equipo B gana 2-1
  { id: 'p7-1', partido_id: '7', jugador_id: '1', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p7-2', partido_id: '7', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 0 },
  { id: 'p7-3', partido_id: '7', jugador_id: '3', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p7-4', partido_id: '7', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p7-5', partido_id: '7', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p7-6', partido_id: '7', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p7-7', partido_id: '7', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p7-8', partido_id: '7', jugador_id: '8', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p7-9', partido_id: '7', jugador_id: '9', equipo: 'B', goles: 1, asistencias: 1 },
  { id: 'p7-10', partido_id: '7', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p7-11', partido_id: '7', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p7-12', partido_id: '7', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
  
  // Partido 8: Equipo A gana 4-1
  { id: 'p8-1', partido_id: '8', jugador_id: '1', equipo: 'A', goles: 2, asistencias: 1 },
  { id: 'p8-2', partido_id: '8', jugador_id: '2', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p8-3', partido_id: '8', jugador_id: '3', equipo: 'A', goles: 1, asistencias: 1 },
  { id: 'p8-4', partido_id: '8', jugador_id: '4', equipo: 'A', goles: 0, asistencias: 1 },
  { id: 'p8-5', partido_id: '8', jugador_id: '5', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p8-6', partido_id: '8', jugador_id: '6', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p8-7', partido_id: '8', jugador_id: '7', equipo: 'A', goles: 0, asistencias: 0 },
  { id: 'p8-8', partido_id: '8', jugador_id: '8', equipo: 'B', goles: 1, asistencias: 0 },
  { id: 'p8-9', partido_id: '8', jugador_id: '9', equipo: 'B', goles: 0, asistencias: 1 },
  { id: 'p8-10', partido_id: '8', jugador_id: '10', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p8-11', partido_id: '8', jugador_id: '11', equipo: 'B', goles: 0, asistencias: 0 },
  { id: 'p8-12', partido_id: '8', jugador_id: '12', equipo: 'B', goles: 0, asistencias: 0 },
]

const mockPremios: Premio[] = [
  { 
    id: '1', 
    nombre_terna: 'Mejor Gol del Año', 
    descripcion: 'El gol más espectacular de la temporada', 
    año: 2026,
    cerrado: false,
    ganador_id: null
  },
  { 
    id: '2', 
    nombre_terna: 'Mejor Jugada', 
    descripcion: 'La jugada colectiva más brillante', 
    año: 2026,
    cerrado: false,
    ganador_id: null
  },
]

const mockNominaciones: Nominacion[] = [
  { premio_id: '1', jugador_id: '1' },
  { premio_id: '1', jugador_id: '2' },
  { premio_id: '1', jugador_id: '9' },
  { premio_id: '2', jugador_id: '3' },
  { premio_id: '2', jugador_id: '4' },
  { premio_id: '2', jugador_id: '1' },
]

const mockVotos: Voto[] = []

interface StoreState {
  jugadores: Jugador[]
  partidos: Partido[]
  participaciones: Participacion[]
  premios: Premio[]
  nominaciones: Nominacion[]
  votos: Voto[]
  isAdmin: boolean
  
  // Actions
  setAdmin: (isAdmin: boolean) => void
  addJugador: (jugador: Omit<Jugador, 'id'>) => void
  updateJugador: (id: string, jugador: Partial<Jugador>) => void
  addPartido: (partido: Omit<Partido, 'id'>, participaciones: Omit<Participacion, 'id' | 'partido_id'>[]) => void
  addPremio: (premio: Omit<Premio, 'id' | 'cerrado' | 'ganador_id'>, nominados: string[]) => void
  cerrarPremio: (premioId: string, ganadorId: string) => void
  addVoto: (premioId: string, jugadorId: string, voterToken: string) => void
  hasVoted: (premioId: string, voterToken: string) => boolean
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      jugadores: mockJugadores,
      partidos: mockPartidos,
      participaciones: mockParticipaciones,
      premios: mockPremios,
      nominaciones: mockNominaciones,
      votos: mockVotos,
      isAdmin: false,
      
      setAdmin: (isAdmin) => set({ isAdmin }),
      
      addJugador: (jugador) => set((state) => ({
        jugadores: [...state.jugadores, { ...jugador, id: crypto.randomUUID() }]
      })),
      
      updateJugador: (id, updates) => set((state) => ({
        jugadores: state.jugadores.map(j => j.id === id ? { ...j, ...updates } : j)
      })),
      
      addPartido: (partido, participacionesData) => {
        const partidoId = crypto.randomUUID()
        set((state) => ({
          partidos: [...state.partidos, { ...partido, id: partidoId }],
          participaciones: [
            ...state.participaciones,
            ...participacionesData.map(p => ({
              ...p,
              id: crypto.randomUUID(),
              partido_id: partidoId
            }))
          ]
        }))
      },
      
      addPremio: (premio, nominados) => {
        const premioId = crypto.randomUUID()
        set((state) => ({
          premios: [...state.premios, { ...premio, id: premioId, cerrado: false, ganador_id: null }],
          nominaciones: [
            ...state.nominaciones,
            ...nominados.map(jugadorId => ({ premio_id: premioId, jugador_id: jugadorId }))
          ]
        }))
      },
      
      cerrarPremio: (premioId, ganadorId) => set((state) => ({
        premios: state.premios.map(p => 
          p.id === premioId ? { ...p, cerrado: true, ganador_id: ganadorId } : p
        )
      })),
      
      addVoto: (premioId, jugadorId, voterToken) => set((state) => ({
        votos: [...state.votos, {
          id: crypto.randomUUID(),
          premio_id: premioId,
          jugador_nominado_id: jugadorId,
          voter_token: voterToken,
          created_at: new Date().toISOString()
        }]
      })),
      
      hasVoted: (premioId, voterToken) => {
        return get().votos.some(v => v.premio_id === premioId && v.voter_token === voterToken)
      }
    }),
    {
      name: 'futbol-stats-storage'
    }
  )
)
