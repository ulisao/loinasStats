"use client"

import { cn } from '@/lib/utils'
import { getIniciales, getColorFromName } from '@/lib/stats'

interface PlayerAvatarProps {
  nombre: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-lg',
}

export function PlayerAvatar({ nombre, size = 'md', className }: PlayerAvatarProps) {
  const iniciales = getIniciales(nombre)
  const bgColor = getColorFromName(nombre)

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full font-semibold text-white",
        bgColor,
        sizeClasses[size],
        className
      )}
    >
      {iniciales}
    </div>
  )
}
