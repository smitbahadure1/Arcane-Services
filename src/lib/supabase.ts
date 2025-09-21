import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      service_categories: {
        Row: {
          id: string
          name: string
          icon: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          icon: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          description?: string | null
          created_at?: string
        }
      }
      services: {
        Row: {
          id: string
          title: string
          description: string
          category_id: string | null
          price: number
          image_url: string | null
          rating: number | null
          availability: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category_id?: string | null
          price: number
          image_url?: string | null
          rating?: number | null
          availability?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category_id?: string | null
          price?: number
          image_url?: string | null
          rating?: number | null
          availability?: boolean | null
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          user_id: string | null
          service_id: string | null
          booking_date: string
          booking_time: string
          status: string | null
          total_price: number
          customer_name: string
          customer_phone: string
          customer_address: string
          special_instructions: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          service_id?: string | null
          booking_date: string
          booking_time: string
          status?: string | null
          total_price: number
          customer_name: string
          customer_phone: string
          customer_address: string
          special_instructions?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          service_id?: string | null
          booking_date?: string
          booking_time?: string
          status?: string | null
          total_price?: number
          customer_name?: string
          customer_phone?: string
          customer_address?: string
          special_instructions?: string | null
          created_at?: string
        }
      }
    }
  }
}