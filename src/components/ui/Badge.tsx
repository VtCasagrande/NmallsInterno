import React from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  className?: string
}

export function Badge({
  variant = 'default',
  size = 'md',
  children,
  className,
  ...props
}: BadgeProps) {
  const variantClasses = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    danger: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

type DeliveryStatus = 'pendente' | 'em_rota' | 'entregue' | 'cancelado' | 'atrasado' | 'devolvido'

interface DeliveryStatusBadgeProps {
  status: DeliveryStatus
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function DeliveryStatusBadge({ status, size = 'md', className }: DeliveryStatusBadgeProps) {
  const statusConfig: Record<DeliveryStatus, { label: string; variant: BadgeProps['variant'] }> = {
    pendente: { label: 'Pendente', variant: 'info' },
    em_rota: { label: 'Em Rota', variant: 'primary' },
    entregue: { label: 'Entregue', variant: 'success' },
    cancelado: { label: 'Cancelado', variant: 'danger' },
    atrasado: { label: 'Atrasado', variant: 'warning' },
    devolvido: { label: 'Devolvido', variant: 'secondary' },
  }

  const config = statusConfig[status] || { label: 'Desconhecido', variant: 'default' }

  return (
    <Badge variant={config.variant} size={size} className={className}>
      {config.label}
    </Badge>
  )
}

export function PurchaseStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    'aguardando': { variant: 'warning', label: 'Aguardando' },
    'pedido_realizado': { variant: 'info', label: 'Pedido Realizado' },
    'chegou': { variant: 'success', label: 'Chegou' },
    'cliente_avisado': { variant: 'primary', label: 'Cliente Avisado' },
  }

  const { variant, label } = statusMap[status] || { variant: 'default', label: status }

  return <Badge variant={variant}>{label}</Badge>
}

export function ExchangeStatusBadge({ status }: { status: string }) {
  const statusMap: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    'aguardando_devolver': { variant: 'warning', label: 'Aguardando Devolver' },
    'solicitado': { variant: 'info', label: 'Solicitado' },
    'coletado': { variant: 'primary', label: 'Coletado' },
    'aguardando_devolucao': { variant: 'secondary', label: 'Aguardando Devolução' },
  }

  const { variant, label } = statusMap[status] || { variant: 'default', label: status }

  return <Badge variant={variant}>{label}</Badge>
} 