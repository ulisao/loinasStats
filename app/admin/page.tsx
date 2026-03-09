"use client"

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useStore } from '@/lib/store'
import { Navigation } from '@/components/navigation'
import { PlayerAvatar } from '@/components/player-avatar'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { 
  Users, 
  Calendar, 
  Trophy, 
  Plus, 
  Save,
  X,
  Minus,
  Check
} from 'lucide-react'

interface ParticipacionForm {
  jugador_id: string
  equipo: 'A' | 'B'
  goles: number
  asistencias: number
}

// ─── Componente interno que usa useSearchParams ───────────────────────────────
function AdminContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { 
    jugadores, 
    isAdmin, 
    addJugador, 
    updateJugador,
    addPartido,
    addPremio
  } = useStore()
  
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'jugadores')
  
  // Jugador form
  const [nuevoJugador, setNuevoJugador] = useState({ nombre: '', apodo: '' })
  
  // Partido form
  const [partidoForm, setPartidoForm] = useState({
    fecha: new Date().toISOString().split('T')[0],
    formato: '7v7',
    resultado_equipo_a: 0,
    resultado_equipo_b: 0,
    notas: ''
  })
  const [participacionesForm, setParticipacionesForm] = useState<ParticipacionForm[]>([])
  
  // Premio form
  const [premioForm, setPremioForm] = useState({
    nombre_terna: '',
    descripcion: '',
    año: new Date().getFullYear()
  })
  const [nominadosSeleccionados, setNominadosSeleccionados] = useState<string[]>([])

  useEffect(() => {
    if (!isAdmin) {
      router.push('/')
    }
  }, [isAdmin, router])

  if (!isAdmin) {
    return null
  }

  const handleAddJugador = () => {
    if (!nuevoJugador.nombre.trim()) return
    
    addJugador({
      nombre: nuevoJugador.nombre.trim(),
      apodo: nuevoJugador.apodo.trim() || null,
      activo: true
    })
    
    setNuevoJugador({ nombre: '', apodo: '' })
  }

  const handleToggleJugadorActivo = (id: string, activo: boolean) => {
    updateJugador(id, { activo: !activo })
  }

  const handleAddToEquipo = (jugadorId: string, equipo: 'A' | 'B') => {
    const existing = participacionesForm.find(p => p.jugador_id === jugadorId)
    if (existing) {
      setParticipacionesForm(prev => prev.filter(p => p.jugador_id !== jugadorId))
      if (existing.equipo === equipo) return
    }
    
    setParticipacionesForm(prev => [...prev, {
      jugador_id: jugadorId,
      equipo,
      goles: 0,
      asistencias: 0
    }])
  }

  const handleUpdateParticipacion = (jugadorId: string, field: 'goles' | 'asistencias', value: number) => {
    setParticipacionesForm(prev => prev.map(p => 
      p.jugador_id === jugadorId ? { ...p, [field]: Math.max(0, value) } : p
    ))
  }

  const handleSubmitPartido = () => {
    if (participacionesForm.length === 0) return
    
    addPartido(
      {
        fecha: partidoForm.fecha,
        formato: partidoForm.formato,
        resultado_equipo_a: partidoForm.resultado_equipo_a,
        resultado_equipo_b: partidoForm.resultado_equipo_b,
        notas: partidoForm.notas || null
      },
      participacionesForm
    )
    
    setPartidoForm({
      fecha: new Date().toISOString().split('T')[0],
      formato: '7v7',
      resultado_equipo_a: 0,
      resultado_equipo_b: 0,
      notas: ''
    })
    setParticipacionesForm([])
  }

  const handleToggleNominado = (jugadorId: string) => {
    setNominadosSeleccionados(prev => 
      prev.includes(jugadorId)
        ? prev.filter(id => id !== jugadorId)
        : [...prev, jugadorId]
    )
  }

  const handleSubmitPremio = () => {
    if (!premioForm.nombre_terna.trim() || nominadosSeleccionados.length < 2) return
    
    addPremio(
      {
        nombre_terna: premioForm.nombre_terna.trim(),
        descripcion: premioForm.descripcion.trim(),
        año: premioForm.año
      },
      nominadosSeleccionados
    )
    
    setPremioForm({
      nombre_terna: '',
      descripcion: '',
      año: new Date().getFullYear()
    })
    setNominadosSeleccionados([])
  }

  const equipoA = participacionesForm.filter(p => p.equipo === 'A')
  const equipoB = participacionesForm.filter(p => p.equipo === 'B')
  const jugadoresDisponibles = jugadores.filter(j => 
    j.activo && !participacionesForm.some(p => p.jugador_id === j.id)
  )

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="lg:ml-64 pb-20 lg:pb-8">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-balance">Panel de Administracion</h1>
            <p className="text-muted-foreground mt-1">Gestiona jugadores, partidos y premios</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="jugadores">
                <Users className="h-4 w-4 mr-2" />
                Jugadores
              </TabsTrigger>
              <TabsTrigger value="partidos">
                <Calendar className="h-4 w-4 mr-2" />
                Partidos
              </TabsTrigger>
              <TabsTrigger value="premios">
                <Trophy className="h-4 w-4 mr-2" />
                Premios
              </TabsTrigger>
            </TabsList>

            {/* Jugadores Tab */}
            <TabsContent value="jugadores">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Agregar Jugador
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre completo</Label>
                      <Input
                        id="nombre"
                        value={nuevoJugador.nombre}
                        onChange={e => setNuevoJugador(prev => ({ ...prev, nombre: e.target.value }))}
                        placeholder="Juan Perez"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="apodo">Apodo (opcional)</Label>
                      <Input
                        id="apodo"
                        value={nuevoJugador.apodo}
                        onChange={e => setNuevoJugador(prev => ({ ...prev, apodo: e.target.value }))}
                        placeholder="El Tanque"
                      />
                    </div>
                    <Button onClick={handleAddJugador} className="w-full">
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Jugador
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Lista de Jugadores</CardTitle>
                    <CardDescription>
                      {jugadores.filter(j => j.activo).length} activos, {jugadores.filter(j => !j.activo).length} inactivos
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {jugadores.map(jugador => (
                        <div 
                          key={jugador.id}
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                        >
                          <PlayerAvatar nombre={jugador.nombre} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {jugador.apodo || jugador.nombre}
                            </p>
                            {jugador.apodo && (
                              <p className="text-xs text-muted-foreground truncate">
                                {jugador.nombre}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={jugador.activo ? 'default' : 'secondary'}>
                              {jugador.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                            <Switch
                              checked={jugador.activo}
                              onCheckedChange={() => handleToggleJugadorActivo(jugador.id, jugador.activo)}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Partidos Tab */}
            <TabsContent value="partidos">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Cargar Nuevo Partido
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-2">
                      <Label htmlFor="fecha">Fecha</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={partidoForm.fecha}
                        onChange={e => setPartidoForm(prev => ({ ...prev, fecha: e.target.value }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="formato">Formato</Label>
                      <select
                        id="formato"
                        value={partidoForm.formato}
                        onChange={e => setPartidoForm(prev => ({ ...prev, formato: e.target.value }))}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
                      >
                        <option value="5v5">5v5</option>
                        <option value="7v7">7v7</option>
                        <option value="9v9">9v9</option>
                        <option value="11v11">11v11</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label>Resultado</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min="0"
                          value={partidoForm.resultado_equipo_a}
                          onChange={e => setPartidoForm(prev => ({ 
                            ...prev, 
                            resultado_equipo_a: parseInt(e.target.value) || 0 
                          }))}
                          className="w-16 text-center"
                        />
                        <span className="text-muted-foreground">-</span>
                        <Input
                          type="number"
                          min="0"
                          value={partidoForm.resultado_equipo_b}
                          onChange={e => setPartidoForm(prev => ({ 
                            ...prev, 
                            resultado_equipo_b: parseInt(e.target.value) || 0 
                          }))}
                          className="w-16 text-center"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notas">Notas (opcional)</Label>
                      <Input
                        id="notas"
                        value={partidoForm.notas}
                        onChange={e => setPartidoForm(prev => ({ ...prev, notas: e.target.value }))}
                        placeholder="Partido muy renido..."
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-3">
                      <Label>Jugadores Disponibles</Label>
                      <div className="space-y-2 max-h-64 overflow-y-auto p-2 rounded-lg border">
                        {jugadoresDisponibles.map(jugador => (
                          <div 
                            key={jugador.id}
                            className="flex items-center gap-2 p-2 rounded bg-muted/50"
                          >
                            <PlayerAvatar nombre={jugador.nombre} size="sm" />
                            <span className="flex-1 text-sm truncate">
                              {jugador.apodo || jugador.nombre}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToEquipo(jugador.id, 'A')}
                            >
                              A
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAddToEquipo(jugador.id, 'B')}
                            >
                              B
                            </Button>
                          </div>
                        ))}
                        {jugadoresDisponibles.length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            Todos los jugadores estan asignados
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-primary">Equipo A ({equipoA.length})</Label>
                      <div className="space-y-2 p-2 rounded-lg border border-primary/30 bg-primary/5 min-h-64">
                        {equipoA.map(p => {
                          const jugador = jugadores.find(j => j.id === p.jugador_id)!
                          return (
                            <div 
                              key={p.jugador_id}
                              className="flex items-center gap-2 p-2 rounded bg-background"
                            >
                              <PlayerAvatar nombre={jugador.nombre} size="sm" />
                              <span className="flex-1 text-sm truncate">
                                {jugador.apodo || jugador.nombre}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'goles', p.goles - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs">{p.goles}G</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'goles', p.goles + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'asistencias', p.asistencias - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs">{p.asistencias}A</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'asistencias', p.asistencias + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive"
                                onClick={() => handleAddToEquipo(p.jugador_id, 'A')}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Equipo B ({equipoB.length})</Label>
                      <div className="space-y-2 p-2 rounded-lg border min-h-64">
                        {equipoB.map(p => {
                          const jugador = jugadores.find(j => j.id === p.jugador_id)!
                          return (
                            <div 
                              key={p.jugador_id}
                              className="flex items-center gap-2 p-2 rounded bg-muted/50"
                            >
                              <PlayerAvatar nombre={jugador.nombre} size="sm" />
                              <span className="flex-1 text-sm truncate">
                                {jugador.apodo || jugador.nombre}
                              </span>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'goles', p.goles - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs">{p.goles}G</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'goles', p.goles + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'asistencias', p.asistencias - 1)}>
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-6 text-center text-xs">{p.asistencias}A</span>
                                <Button size="icon" variant="ghost" className="h-6 w-6"
                                  onClick={() => handleUpdateParticipacion(p.jugador_id, 'asistencias', p.asistencias + 1)}>
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <Button size="icon" variant="ghost" className="h-6 w-6 text-destructive"
                                onClick={() => handleAddToEquipo(p.jugador_id, 'B')}>
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitPartido} 
                    className="w-full"
                    disabled={participacionesForm.length === 0}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Partido
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Premios Tab */}
            <TabsContent value="premios">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Crear Nueva Terna
                  </CardTitle>
                  <CardDescription>
                    Crea una terna para que los usuarios puedan votar
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="nombre_terna">Nombre del Premio</Label>
                      <Input
                        id="nombre_terna"
                        value={premioForm.nombre_terna}
                        onChange={e => setPremioForm(prev => ({ ...prev, nombre_terna: e.target.value }))}
                        placeholder="Mejor Gol del Ano"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descripcion">Descripcion</Label>
                      <Input
                        id="descripcion"
                        value={premioForm.descripcion}
                        onChange={e => setPremioForm(prev => ({ ...prev, descripcion: e.target.value }))}
                        placeholder="El gol mas espectacular..."
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Selecciona Nominados (minimo 2)</Label>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {jugadores.filter(j => j.activo).map(jugador => {
                        const isSelected = nominadosSeleccionados.includes(jugador.id)
                        return (
                          <button
                            key={jugador.id}
                            onClick={() => handleToggleNominado(jugador.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                              isSelected 
                                ? 'border-primary bg-primary/10' 
                                : 'border-border hover:bg-muted'
                            }`}
                          >
                            <PlayerAvatar nombre={jugador.nombre} size="sm" />
                            <span className="flex-1 text-sm text-left truncate">
                              {jugador.apodo || jugador.nombre}
                            </span>
                            {isSelected && (
                              <Check className="h-4 w-4 text-primary" />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <Button 
                    onClick={handleSubmitPremio} 
                    className="w-full"
                    disabled={!premioForm.nombre_terna.trim() || nominadosSeleccionados.length < 2}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Terna ({nominadosSeleccionados.length} nominados)
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}

// ─── Export default con Suspense boundary ────────────────────────────────────
export default function AdminPage() {
  return (
    <Suspense fallback={null}>
      <AdminContent />
    </Suspense>
  )
}