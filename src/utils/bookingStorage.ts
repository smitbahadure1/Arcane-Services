// Simple booking storage using localStorage for demo purposes
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

export const saveBooking = (booking: Omit<Booking, 'id' | 'created_at'>): Booking => {
  const bookings = getBookings()
  const newBooking: Booking = {
    ...booking,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  }

  console.log('🔥 Saving booking with ID:', newBooking.id)
  console.log('🔥 Booking data:', newBooking)

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
    const parsedBookings = bookings ? JSON.parse(bookings) : []
    console.log('📊 Retrieved bookings:', parsedBookings.length)
    console.log('📊 Booking IDs:', parsedBookings.map((b: Booking) => b.id))
    return parsedBookings
  } catch (error) {
    console.error('❌ Error getting bookings:', error)
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
