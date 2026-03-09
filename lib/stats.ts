import type { Jugador, Partido, Participacion, JugadorStats, PartidoConParticipaciones } from './types'

const UMBRAL_PARTIDOS = 0.3 // 30% minimum participation threshold

export function calcularStatsJugador(
  jugador: Jugador,
  partidos: Partido[],
  participaciones: Participacion[]
): JugadorStats {
  const participacionesJugador = participaciones.filter(p => p.jugador_id === jugador.id)
  const partidosJugados = participacionesJugador.length
  const totalPartidos = partidos.length
  
  let ganados = 0
  let empatados = 0
  let perdidos = 0
  let goles = 0
  let asistencias = 0
  
  participacionesJugador.forEach(participacion => {
    const partido = partidos.find(p => p.id === participacion.partido_id)
    if (!partido) return
    
    goles += participacion.goles
    asistencias += participacion.asistencias
    
    const { resultado_equipo_a, resultado_equipo_b } = partido
    const equipoJugador = participacion.equipo
    
    if (resultado_equipo_a === resultado_equipo_b) {
      empatados++
    } else if (
      (equipoJugador === 'A' && resultado_equipo_a > resultado_equipo_b) ||
      (equipoJugador === 'B' && resultado_equipo_b > resultado_equipo_a)
    ) {
      ganados++
    } else {
      perdidos++
    }
  })
  
  const cumpleUmbral = totalPartidos > 0 && (partidosJugados / totalPartidos) >= UMBRAL_PARTIDOS
  const winRate = partidosJugados > 0 && cumpleUmbral 
    ? (ganados / partidosJugados) * 100 
    : null
  
  return {
    jugador,
    partidosJugados,
    partidosGanados: ganados,
    partidosEmpatados: empatados,
    partidosPerdidos: perdidos,
    winRate,
    goles,
    asistencias,
    cumpleUmbral
  }
}

export function calcularStatsGlobales(
  jugadores: Jugador[],
  partidos: Partido[],
  participaciones: Participacion[]
) {
  const totalPartidos = partidos.length
  const totalGoles = partidos.reduce((sum, p) => sum + p.resultado_equipo_a + p.resultado_equipo_b, 0)
  
  const statsJugadores = jugadores
    .filter(j => j.activo)
    .map(j => calcularStatsJugador(j, partidos, participaciones))
  
  // Top goleadores
  const topGoleadores = [...statsJugadores]
    .sort((a, b) => b.goles - a.goles)
    .slice(0, 3)
  
  // Top asistidores
  const topAsistidores = [...statsJugadores]
    .sort((a, b) => b.asistencias - a.asistencias)
    .slice(0, 3)
  
  // Top win rate (only those who meet threshold)
  const topWinRate = [...statsJugadores]
    .filter(s => s.cumpleUmbral && s.winRate !== null)
    .sort((a, b) => (b.winRate ?? 0) - (a.winRate ?? 0))
    .slice(0, 3)
  
  // Peor win rate (only those who meet threshold)
  const peorWinRate = [...statsJugadores]
    .filter(s => s.cumpleUmbral && s.winRate !== null)
    .sort((a, b) => (a.winRate ?? 100) - (b.winRate ?? 100))
    .slice(0, 3)
  
  return {
    totalPartidos,
    totalGoles,
    statsJugadores,
    topGoleadores,
    topAsistidores,
    topWinRate,
    peorWinRate
  }
}

export function getPartidosConParticipaciones(
  partidos: Partido[],
  participaciones: Participacion[],
  jugadores: Jugador[]
): PartidoConParticipaciones[] {
  return partidos.map(partido => ({
    ...partido,
    participaciones: participaciones
      .filter(p => p.partido_id === partido.id)
      .map(p => ({
        ...p,
        jugador: jugadores.find(j => j.id === p.jugador_id)!
      }))
  }))
}

export function getHistorialPartidosJugador(
  jugadorId: string,
  partidos: Partido[],
  participaciones: Participacion[],
  jugadores: Jugador[]
): PartidoConParticipaciones[] {
  const partidoIds = participaciones
    .filter(p => p.jugador_id === jugadorId)
    .map(p => p.partido_id)
  
  const partidosDelJugador = partidos.filter(p => partidoIds.includes(p.id))
  
  return getPartidosConParticipaciones(partidosDelJugador, participaciones, jugadores)
}

export function formatFecha(fecha: string): string {
  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const [year, month, day] = fecha.split('-').map(Number)
  return `${day} ${meses[month - 1]} ${year}`
}

export function getIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function getColorFromName(nombre: string): string {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
    'bg-orange-500',
    'bg-cyan-500'
  ]
  
  let hash = 0
  for (let i = 0; i < nombre.length; i++) {
    hash = nombre.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  return colors[Math.abs(hash) % colors.length]
}
