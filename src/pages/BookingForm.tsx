import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Clock, User, Phone, MapPin, MessageSquare, ArrowLeft } from 'lucide-react'
import { format, addDays, isToday, isTomorrow } from 'date-fns'
import { useAuth } from '../contexts/AuthContext'
import PaymentModal from '../components/PaymentModal'
import { sampleServices } from '../data/sampleServices'
import { cloudSaveBooking, fsSaveBooking } from '../utils/bookingStorage'

const BookingForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('')
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    address: '',
    instructions: ''
  })
  const [loading, setLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)
  const [pendingBookingData, setPendingBookingData] = useState<any>(null)

  // Generate available dates (next 30 days)
  const availableDates = Array.from({ length: 30 }, (_, i) => addDays(new Date(), i))

  // Available time slots
  const timeSlots = [
    '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM',
    '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM',
    '4:00 PM', '5:00 PM', '6:00 PM'
  ]

  useEffect(() => {
    if (id) {
      fetchService(id)
    }
  }, [id])

  const fetchService = async (serviceId: string) => {
    const foundService = sampleServices.find(s => s.id === serviceId)
    if (foundService) {
      setService(foundService)
    }
  }

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    return format(date, 'MMM d')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !user || !service) return

    setLoading(true)

    try {
      // Create booking data
      const bookingData = {
        user_id: user.uid,
        service_id: service.id,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        booking_time: selectedTime,
        total_price: service.price,
        customer_name: customerData.name,
        customer_phone: customerData.phone,
        customer_address: customerData.address,
        special_instructions: customerData.instructions,
        status: 'pending' as const,
        service: {
          title: service.title,
          image_url: service.image_url
        }
      }

      // Save booking as pending
      // Prefer Firestore if available; else Supabase; else local
      let savedBooking = await fsSaveBooking(bookingData)
      if (!savedBooking?.id) {
        savedBooking = await cloudSaveBooking(bookingData)
      }

      // Store for payment retry if needed
      const paymentData = {
        amount: service.price,
        customerName: customerData.name,
        customerEmail: user.email || '',
        customerPhone: customerData.phone,
        description: service.title,
        bookingId: savedBooking.id
      }

      setPendingBookingData(paymentData)

      // Show payment modal instead of confirmation
      setShowPayment(true)
    } catch (error) {
      console.error('Error creating booking:', error)
      alert('Error creating booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePaymentSuccess = (transactionId: string) => {
    // Update booking status to confirmed
    const bookings = JSON.parse(localStorage.getItem('home_service_bookings') || '[]')
    const bookingIndex = bookings.findIndex((b: any) => b.id === pendingBookingData.bookingId)

    if (bookingIndex !== -1) {
      bookings[bookingIndex].status = 'confirmed'
      bookings[bookingIndex].transaction_id = transactionId
      bookings[bookingIndex].payment_verified_at = new Date().toISOString()
      localStorage.setItem('home_service_bookings', JSON.stringify(bookings))
    }

    // Clear pending booking data
    localStorage.removeItem('pending_booking')
    setPendingBookingData(null)

    // Navigate to success page
    navigate(`/payment/success?transaction_id=${transactionId}&booking_id=${pendingBookingData.bookingId}`)
  }

  const handlePaymentFailure = (error: string) => {
    // Store booking data for retry
    localStorage.setItem('pending_booking', JSON.stringify({
      serviceId: service.id,
      customerData,
      selectedDate: format(selectedDate!, 'yyyy-MM-dd'),
      selectedTime
    }))

    // Show user-friendly error message
    if (error.includes('Network')) {
      alert(`⚠️ Network Issue Detected

Your booking was created successfully, but there was a network connectivity issue.

What happened:
• Your booking for "${service.title}" is saved
• Payment system encountered network issues
• This is common in demo environments

Options:
1. Try payment again (recommended)
2. Contact admin for manual verification
3. Payment will be processed when network improves

Your booking reference: ${pendingBookingData?.bookingId || 'N/A'}`)
    } else {
      alert(`Payment Error: ${error}

Please try again or contact support.`)
    }

    // Navigate to failure page with error details
    navigate(`/payment/failure?error=${encodeURIComponent(error)}`)
  }

  const handleClosePayment = () => {
    setShowPayment(false)
    setPendingBookingData(null)
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(`/service/${id}`)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Service</span>
        </button>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-blue-600 text-white p-6">
            <h1 className="text-2xl font-bold">Book Your Service</h1>
            <p className="text-blue-100 mt-2">{service.title}</p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-8">
            {/* Date Selection */}
            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                <Calendar className="h-5 w-5" />
                <span>Select Date</span>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-7 gap-3">
                {availableDates.slice(0, 14).map((date) => (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 text-center rounded-lg border transition-colors ${
                      selectedDate && format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                    }`}
                  >
                    <div className="text-sm font-medium">{formatDateLabel(date)}</div>
                    <div className="text-xs text-gray-500">{format(date, 'MMM d')}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                  <Clock className="h-5 w-5" />
                  <span>Select Time</span>
                </label>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`p-3 text-center rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Customer Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                  <User className="h-5 w-5" />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                  <Phone className="h-5 w-5" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  pattern="[6-9][0-9]{9}"
                  value={customerData.phone}
                  onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your 10-digit phone number"
                  title="Please enter a valid 10-digit mobile number starting with 6, 7, 8, or 9"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {customerData.phone.length}/10 characters
                </p>
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                <MapPin className="h-5 w-5" />
                <span>Service Address</span>
              </label>
              <textarea
                required
                value={customerData.address}
                onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                rows={3}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter the full address where service is needed"
              />
            </div>

            <div>
              <label className="flex items-center space-x-2 text-lg font-semibold text-gray-800 mb-4">
                <MessageSquare className="h-5 w-5" />
                <span>Special Instructions (Optional)</span>
              </label>
              <textarea
                value={customerData.instructions}
                onChange={(e) => setCustomerData({ ...customerData, instructions: e.target.value })}
                rows={4}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any specific requirements or instructions for the service provider..."
              />
            </div>

            {/* Booking Summary */}
            {selectedDate && selectedTime && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>
                <div className="space-y-2 text-gray-600">
                  <div className="flex justify-between">
                    <span>Service:</span>
                    <span className="font-medium">{service.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Date:</span>
                    <span className="font-medium">{format(selectedDate, 'MMMM d, yyyy')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="border-t pt-2 mt-4">
                    <div className="flex justify-between text-lg font-bold text-gray-800">
                      <span>Total Price:</span>
                      <span>₹{service.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => navigate(`/service/${id}`)}
                className="flex-1 bg-gray-300 text-gray-700 py-4 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedDate || !selectedTime || loading}
                className="flex-1 bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Booking...' : 'Confirm Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Payment Modal */}
      {showPayment && pendingBookingData && (
        <PaymentModal
          isOpen={showPayment}
          onClose={handleClosePayment}
          bookingData={pendingBookingData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentFailure={handlePaymentFailure}
        />
      )}
    </div>
  )
}

export default BookingForm