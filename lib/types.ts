// =====================================================
// SUPABASE CONNECTION - Replace with your credentials
// =====================================================
// export const SUPABASE_URL = 'YOUR_SUPABASE_URL'
// export const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'

export interface Jugador {
  id: string
  nombre: string
  apodo: string | null
  activo: boolean
}

export interface Partido {
  id: string
  fecha: string
  formato: string
  resultado_equipo_a: number
  resultado_equipo_b: number
  notas: string | null
}

export interface Participacion {
  id: string
  partido_id: string
  jugador_id: string
  equipo: 'A' | 'B'
  goles: number
  asistencias: number
}

export interface Premio {
  id: string
  nombre_terna: string
  descripcion: string
  año: number
  cerrado: boolean
  ganador_id: string | null
}

export interface Voto {
  id: string
  premio_id: string
  jugador_nominado_id: string
  voter_token: string
  created_at: string
}

export interface Nominacion {
  premio_id: string
  jugador_id: string
}

export interface JugadorStats {
  jugador: Jugador
  partidosJugados: number
  partidosGanados: number
  partidosEmpatados: number
  partidosPerdidos: number
  winRate: number | null
  goles: number
  asistencias: number
  cumpleUmbral: boolean
}

export interface PartidoConParticipaciones extends Partido {
  participaciones: (Participacion & { jugador: Jugador })[]
}
