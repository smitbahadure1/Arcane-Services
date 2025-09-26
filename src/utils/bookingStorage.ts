// Booking storage with Supabase first, falling back to localStorage
import { supabase } from '../lib/supabase'
import { db } from '../lib/firebase'
import { collection, addDoc, getDocs, query, where, orderBy, updateDoc, doc } from 'firebase/firestore'
export interface Booking {
  id: string
  user_id: string
  service_id: string
  booking_date: string
  booking_time: string
  total_price: number
  customer_name: string
  customer_phone: string
  customer_address: string
  special_instructions: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at: string
  service?: {
    title: string
    image_url?: string
  }
}

const BOOKINGS_KEY = 'home_service_bookings'

const isCloudEnabled = () => {
  try {
    // If env vars are missing, the client may still be created but unusable
    return Boolean((import.meta as any).env.VITE_SUPABASE_URL && (import.meta as any).env.VITE_SUPABASE_ANON_KEY)
  } catch {
    return false
  }
}

export const saveBooking = (booking: Omit<Booking, 'id' | 'created_at'>): Booking => {
  const bookings = getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }

  bookings.push(newBooking)
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))

  // Notify other tabs/components of the update
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bookingsUpdated'))
  }

  return newBooking
}

export const getBookings = (): Booking[] => {
  try {
    const bookings = localStorage.getItem(BOOKINGS_KEY)
    return bookings ? JSON.parse(bookings) : []
  } catch {
    return []
  }
}

export const getBookingsByUserId = (userId: string): Booking[] => {
  return getBookings().filter(booking => booking.user_id === userId)
}

export const updateBookingStatus = (bookingId: string, status: Booking['status']): boolean => {
  const bookings = getBookings()
  const bookingIndex = bookings.findIndex(b => b.id === bookingId)

  if (bookingIndex !== -1) {
    bookings[bookingIndex].status = status
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings))

    // Notify other tabs/components of the update
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('bookingsUpdated'))
    }

    return true
  }
  return false
}

// Cloud (Supabase) implementations
export const cloudSaveBooking = async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  if (!isCloudEnabled()) return saveBooking(booking)
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      user_id: booking.user_id,
      service_id: booking.service_id,
      booking_date: booking.booking_date,
      booking_time: booking.booking_time,
      total_price: booking.total_price,
      customer_name: booking.customer_name,
      customer_phone: booking.customer_phone,
      customer_address: booking.customer_address,
      special_instructions: booking.special_instructions,
      status: booking.status,
    })
    .select('*')
    .single()

  if (error || !data) {
    return saveBooking(booking)
  }

  const created: Booking = {
    id: data.id,
    user_id: data.user_id!,
    service_id: data.service_id!,
    booking_date: data.booking_date,
    booking_time: data.booking_time,
    total_price: data.total_price,
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    customer_address: data.customer_address,
    special_instructions: data.special_instructions || '',
    status: (data.status as any) || 'pending',
    created_at: data.created_at,
  }
  return created
}

export const cloudGetBookings = async (): Promise<Booking[]> => {
  if (!isCloudEnabled()) return getBookings()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
  if (error || !data) return getBookings()
  return data as unknown as Booking[]
}

export const cloudGetBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  if (!isCloudEnabled()) return getBookingsByUserId(userId)
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error || !data) return getBookingsByUserId(userId)
  return data as unknown as Booking[]
}

export const cloudUpdateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
  if (!isCloudEnabled()) return updateBookingStatus(bookingId, status)
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)
  if (error) return false
  return true
}

// Firestore implementations (primary when Supabase not configured)
export const fsSaveBooking = async (booking: Omit<Booking, 'id' | 'created_at'>): Promise<Booking> => {
  const cloudAttempt = (async () => {
    try {
      const ref = await addDoc(collection(db, 'bookings'), {
        ...booking,
        created_at: new Date().toISOString(),
      })
      return { id: ref.id, created_at: new Date().toISOString(), ...booking }
    } catch {
      return saveBooking(booking)
    }
  })()

  // Fail fast if Firestore is slow/unreachable to avoid UI freeze
  const timeoutMs = 5000
  const timeoutFallback = new Promise<Booking>((resolve) => {
    setTimeout(() => resolve(saveBooking(booking)), timeoutMs)
  })

  // Whichever resolves first will be used; the other result is ignored
  return Promise.race([cloudAttempt, timeoutFallback])
}

export const fsGetBookings = async (): Promise<Booking[]> => {
  try {
    const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Booking[]
  } catch {
    return getBookings()
  }
}

export const fsGetBookingsByUserId = async (userId: string): Promise<Booking[]> => {
  try {
    const q = query(collection(db, 'bookings'), where('user_id', '==', userId), orderBy('created_at', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...(d.data() as any) })) as Booking[]
  } catch {
    return getBookingsByUserId(userId)
  }
}

export const fsUpdateBookingStatus = async (bookingId: string, status: Booking['status']): Promise<boolean> => {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), { status })
    return true
  } catch {
    return updateBookingStatus(bookingId, status)
  }
}
