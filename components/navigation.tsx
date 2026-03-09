"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { Home, Users, Calendar, Trophy, Settings } from 'lucide-react'

const navItems = [
  { href: '/', label: 'Inicio', icon: Home },
  { href: '/jugadores', label: 'Jugadores', icon: Users },
  { href: '/partidos', label: 'Partidos', icon: Calendar },
  { href: '/premios', label: 'Premios', icon: Trophy },
]

export function Navigation() {
  const pathname = usePathname()
  const { isAdmin, setAdmin } = useStore()

  const handleAdminToggle = () => {
    if (isAdmin) {
      setAdmin(false)
    } else {
      const password = prompt('Ingresa la contraseña de administrador:')
      if (password === 'admin123') {
        setAdmin(true)
      } else if (password !== null) {
        alert('Contraseña incorrecta')
      }
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-full w-64 flex-col border-r border-border bg-card">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Trophy className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">Futbol Stats</span>
        </div>
        
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-border p-4">
          {isAdmin && (
            <Link
              href="/admin"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors mb-2",
                pathname === '/admin'
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Settings className="h-4 w-4" />
              Admin
            </Link>
          )}
          <button
            onClick={handleAdminToggle}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              isAdmin
                ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Settings className="h-4 w-4" />
            {isAdmin ? 'Salir de Admin' : 'Modo Admin'}
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.href !== '/' && pathname.startsWith(item.href))
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
          {isAdmin ? (
            <Link
              href="/admin"
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors",
                pathname === '/admin'
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <Settings className="h-5 w-5" />
              Admin
            </Link>
          ) : (
            <button
              onClick={handleAdminToggle}
              className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-muted-foreground"
            >
              <Settings className="h-5 w-5" />
              Admin
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
