import React, { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { Calendar, Clock, User, Phone, MapPin, MessageSquare, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { getBookingsByUserId, updateBookingStatus } from '../utils/bookingStorage'

const UserBookings: React.FC = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  // Auto-refresh bookings every 5 seconds to show real-time updates
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        fetchBookings()
      }, 5000) // Refresh every 5 seconds

      return () => clearInterval(interval)
    }
  }, [user])

  const fetchBookings = async () => {
    if (user) {
      const userBookings = getBookingsByUserId(user.uid)
      setBookings(userBookings)
    }
    setLoading(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return

    const success = updateBookingStatus(bookingId, 'cancelled')
    
    if (success) {
      fetchBookings() // Refresh the list
    } else {
      alert('Error cancelling booking')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-headline text-primary-900 mb-4">My Bookings</h1>
            <p className="text-body text-primary-600">Manage your service bookings and track their status</p>
          </div>
          <button
            onClick={fetchBookings}
            className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <Calendar className="h-16 w-16 text-primary-400 mx-auto mb-4" />
            <h3 className="text-title text-primary-600 mb-2">No bookings yet</h3>
            <p className="text-body text-primary-500 mb-6">Book your first service to see it here</p>
            <a
              href="/services"
              className="btn-primary inline-block"
            >
              Browse Services
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="card p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-title text-primary-900">
                        {booking.services?.title}
                      </h3>
                      <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Calendar className="h-4 w-4" />
                        <span>{format(new Date(booking.booking_date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Clock className="h-4 w-4" />
                        <span>{booking.booking_time}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-primary-600">
                        <User className="h-4 w-4" />
                        <span>{booking.customer_name}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-primary-600">
                        <Phone className="h-4 w-4" />
                        <span>{booking.customer_phone}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2 text-primary-600 mb-4">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span className="text-sm">{booking.customer_address}</span>
                    </div>

                    {booking.special_instructions && (
                      <div className="flex items-start space-x-2 text-primary-600 mb-4">
                        <MessageSquare className="h-4 w-4 mt-0.5" />
                        <span className="text-sm">{booking.special_instructions}</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-accent-600">
                        ₹{booking.total_price}
                      </span>
                      <span className="text-sm text-primary-500">
                        Booked on {format(new Date(booking.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>

                  {booking.status === 'pending' && (
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="bg-error-500 text-white px-4 py-2 rounded-xl hover:bg-error-600 transition-colors font-semibold"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default UserBookings