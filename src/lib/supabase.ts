import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL ou Anon Key não configurados')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export type User = {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'attendant' | 'driver'
  created_at: string
}

export type Delivery = {
  id: string
  customer_id: string
  driver_id: string | null
  platform: 'frismar' | 'jadlog' | 'shopee' | 'meli'
  status: 'pendente' | 'em_rota' | 'entregue' | 'cancelado' | 'adiado'
  delivery_date: string
  delivery_time: string
  address: string
  zip_code: string
  city: string
  state: string
  total_value: number
  items: DeliveryItem[]
  created_at: string
  updated_at: string
}

export type DeliveryItem = {
  id: string
  delivery_id: string
  product_id: string
  quantity: number
  price: number
}

export type Purchase = {
  id: string
  supplier_id: string
  status: 'aguardando' | 'pedido_realizado' | 'chegou' | 'cliente_avisado'
  is_urgent: boolean
  expected_date: string | null
  total_value: number
  items: PurchaseItem[]
  created_at: string
  updated_at: string
}

export type PurchaseItem = {
  id: string
  purchase_id: string
  product_id: string
  quantity: number
  price: number
}

export type Exchange = {
  id: string
  partner_id: string
  responsible_id: string
  product_id: string
  type: 'emprestamos' | 'pegamos_emprestado' | 'fornecedor_vendedor'
  status: 'aguardando_devolver' | 'solicitado' | 'coletado' | 'aguardando_devolucao'
  request_date: string
  return_date: string | null
  created_at: string
  updated_at: string
}

export type Influencer = {
  id: string
  name: string
  location: string
  followers_count: number
  sales_count: number
  sales_value: number
  commission_rate: number
  created_at: string
  updated_at: string
}

export type Product = {
  id: string
  name: string
  ean: string
  price: number
  stock: number
  created_at: string
  updated_at: string
}

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  zip_code: string
  city: string
  state: string
  created_at: string
  updated_at: string
}

export type Notification = {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
} 