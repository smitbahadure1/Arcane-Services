// Test utility to add sample bookings for testing
export const addSampleBookings = () => {
  const sampleBookings = [
    {
      user_id: 'test-user-1',
      service_id: '1',
      booking_date: '2024-12-26',
      booking_time: '10:00 AM',
      total_price: 50,
      customer_name: 'John Doe',
      customer_phone: '9876543210',
      customer_address: '123 Test Street, Test City',
      special_instructions: 'Please clean thoroughly',
      status: 'pending' as const,
      service: {
        title: 'House Cleaning',
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&auto=format&fit=crop'
      }
    },
    {
      user_id: 'test-user-2',
      service_id: '2',
      booking_date: '2024-12-27',
      booking_time: '2:00 PM',
      total_price: 80,
      customer_name: 'Jane Smith',
      customer_phone: '9876543211',
      customer_address: '456 Sample Avenue, Sample City',
      special_instructions: 'Fix kitchen sink',
      status: 'confirmed' as const,
      service: {
        title: 'Plumbing Repair',
        image_url: 'https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=800&auto=format&fit=crop'
      }
    }
  ]

  const existingBookings = JSON.parse(localStorage.getItem('home_service_bookings') || '[]')

  sampleBookings.forEach(booking => {
    const newBooking = {
      ...booking,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    }
    existingBookings.push(newBooking)
  })

  localStorage.setItem('home_service_bookings', JSON.stringify(existingBookings))
  console.log('✅ Sample bookings added for testing')

  // Trigger custom event to update admin dashboard
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('bookingsUpdated'))
  }
}
