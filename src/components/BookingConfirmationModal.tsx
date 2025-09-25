import React, { useEffect } from 'react'
import { Check, Clock, Phone, MapPin } from 'lucide-react'

interface BookingConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  bookingData?: {
    serviceName: string
    date: string
    time: string
    customerName: string
    phone: string
    address: string
    totalPrice: number
  }
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({
  isOpen,
  onClose,
  bookingData
}) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        onClose()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-gray-700/50">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
            <Check className="h-10 w-10 text-white" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-4">
          Booking Confirmed!
        </h2>

        {/* Message */}
        <p className="text-gray-300 text-center mb-6 leading-relaxed">
          Thank you for choosing Arcane Services. Our team will contact you within 24 hours to confirm your service details.
        </p>

        {/* Booking Details */}
        {bookingData && (
          <div className="bg-gray-800/50 rounded-2xl p-4 mb-6 space-y-3">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-primary-500/20 rounded-lg flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{bookingData.serviceName}</p>
                <p className="text-xs text-gray-400">{bookingData.date} at {bookingData.time}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-accent-500/20 rounded-lg flex items-center justify-center">
                <Phone className="h-4 w-4 text-accent-400" />
              </div>
              <div>
                <p className="text-sm font-medium">{bookingData.customerName}</p>
                <p className="text-xs text-gray-400">{bookingData.phone}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-300">
              <div className="w-8 h-8 bg-success-500/20 rounded-lg flex items-center justify-center">
                <MapPin className="h-4 w-4 text-success-400" />
              </div>
              <div>
                <p className="text-sm font-medium">Service Address</p>
                <p className="text-xs text-gray-400">{bookingData.address}</p>
              </div>
            </div>

            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-300">Total Amount</span>
                <span className="text-lg font-bold text-white">₹{bookingData.totalPrice}</span>
              </div>
            </div>
          </div>
        )}

        {/* Redirecting Message */}
        <p className="text-gray-400 text-center text-sm">
          Redirecting to home page...
        </p>

        {/* Progress Bar */}
        <div className="mt-4 bg-gray-700 rounded-full h-1">
          <div className="bg-gradient-to-r from-green-500 to-green-600 h-1 rounded-full animate-pulse"></div>
        </div>

        {/* Close Button (Optional) */}
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-xl transition-colors duration-200"
        >
          Close
        </button>
      </div>
    </div>
  )
}

export default BookingConfirmationModal
