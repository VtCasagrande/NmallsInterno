import { supabase } from '@/lib/supabase'
import type { 
  User, 
  Delivery, 
  Purchase, 
  Exchange, 
  Influencer, 
  Product, 
  Customer, 
  Notification 
} from '@/lib/supabase'

// Serviços de Usuário
export const userService = {
  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null
    
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return data as User | null
  },
  
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) throw error
    return data
  },
  
  logout: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }
}

// Serviços de Entregas
export const deliveryService = {
  getDeliveries: async () => {
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Delivery[]
  },
  
  getDeliveryById: async (id: string) => {
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        items:delivery_items(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Delivery
  },
  
  createDelivery: async (delivery: Omit<Delivery, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('deliveries')
      .insert(delivery)
      .select()
      .single()
    
    if (error) throw error
    return data as Delivery
  },
  
  updateDeliveryStatus: async (id: string, status: Delivery['status']) => {
    const { data, error } = await supabase
      .from('deliveries')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Delivery
  }
}

// Serviços de Compras
export const purchaseService = {
  getPurchases: async () => {
    const { data, error } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Purchase[]
  },
  
  getPurchaseById: async (id: string) => {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        *,
        items:purchase_items(*)
      `)
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Purchase
  },
  
  createPurchase: async (purchase: Omit<Purchase, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('purchases')
      .insert(purchase)
      .select()
      .single()
    
    if (error) throw error
    return data as Purchase
  },
  
  updatePurchaseStatus: async (id: string, status: Purchase['status']) => {
    const { data, error } = await supabase
      .from('purchases')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Purchase
  }
}

// Serviços de Trocas/Empréstimos
export const exchangeService = {
  getExchanges: async () => {
    const { data, error } = await supabase
      .from('exchanges')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Exchange[]
  },
  
  getExchangeById: async (id: string) => {
    const { data, error } = await supabase
      .from('exchanges')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Exchange
  },
  
  createExchange: async (exchange: Omit<Exchange, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('exchanges')
      .insert(exchange)
      .select()
      .single()
    
    if (error) throw error
    return data as Exchange
  },
  
  updateExchangeStatus: async (id: string, status: Exchange['status']) => {
    const { data, error } = await supabase
      .from('exchanges')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Exchange
  }
}

// Serviços de Influenciadores
export const influencerService = {
  getInfluencers: async () => {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Influencer[]
  },
  
  getInfluencerById: async (id: string) => {
    const { data, error } = await supabase
      .from('influencers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Influencer
  },
  
  createInfluencer: async (influencer: Omit<Influencer, 'id' | 'created_at' | 'updated_at'>) => {
    const { data, error } = await supabase
      .from('influencers')
      .insert(influencer)
      .select()
      .single()
    
    if (error) throw error
    return data as Influencer
  },
  
  updateInfluencer: async (id: string, influencer: Partial<Influencer>) => {
    const { data, error } = await supabase
      .from('influencers')
      .update({ ...influencer, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Influencer
  },
  
  deleteInfluencer: async (id: string) => {
    const { error } = await supabase
      .from('influencers')
      .delete()
      .eq('id', id)
    
    if (error) throw error
    return true
  }
}

// Serviços de Produtos
export const productService = {
  getProducts: async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Product[]
  },
  
  getProductById: async (id: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Product
  },
  
  searchProducts: async (query: string) => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .or(`name.ilike.%${query}%,ean.ilike.%${query}%`)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Product[]
  }
}

// Serviços de Clientes
export const customerService = {
  getCustomers: async () => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Customer[]
  },
  
  getCustomerById: async (id: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Customer
  },
  
  searchCustomers: async (query: string) => {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Customer[]
  }
}

// Serviços de Notificações
export const notificationService = {
  getNotifications: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Notification[]
  },
  
  markAsRead: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data as Notification
  },
  
  markAllAsRead: async (userId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userId)
      .eq('is_read', false)
    
    if (error) throw error
    return true
  }
} 