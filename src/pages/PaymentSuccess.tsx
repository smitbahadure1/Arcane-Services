import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Home, FileText } from 'lucide-react';
import { paymentService } from '../utils/paymentService';

const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState<any>(null);

  const transactionId = searchParams.get('transaction_id');
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    verifyPayment();
  }, [transactionId]);

  const verifyPayment = async () => {
    if (!transactionId) {
      navigate('/payment/failure?error=invalid_transaction');
      return;
    }

    try {
      const response = await paymentService.verifyPayment(transactionId);

      if (response.success) {
        // setPaymentVerified(true);

        // Get booking details from localStorage
        const bookings = JSON.parse(localStorage.getItem('home_service_bookings') || '[]');
        const booking = bookings.find((b: any) => b.id === bookingId);

        if (booking) {
          // Update booking status to confirmed
          booking.status = 'confirmed';
          booking.transaction_id = transactionId;
          booking.payment_verified_at = new Date().toISOString();

          // Save updated booking
          const updatedBookings = bookings.map((b: any) =>
            b.id === bookingId ? booking : b
          );
          localStorage.setItem('home_service_bookings', JSON.stringify(updatedBookings));

          setBookingDetails(booking);
        }
      } else {
        navigate(`/payment/failure?error=${encodeURIComponent(response.error || 'Payment verification failed')}`);
      }
    } catch (error) {
      navigate('/payment/failure?error=payment_verification_error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-600">Your booking has been confirmed</p>
        </div>

        {bookingDetails && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Booking Confirmation</h2>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Booking ID:</span>
                <span className="font-medium text-gray-800">{bookingDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Service:</span>
                <span className="font-medium text-gray-800">{bookingDetails.service?.title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time:</span>
                <span className="font-medium text-gray-800">
                  {bookingDetails.booking_date} at {bookingDetails.booking_time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Customer:</span>
                <span className="font-medium text-gray-800">{bookingDetails.customer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium text-gray-800">₹{bookingDetails.total_price}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction ID:</span>
                <span className="font-medium text-gray-800">{transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Confirmed
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-800 mb-2">How Payment Verification Works:</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Webhook Detection:</strong> When payment hits your bank, UPI gateway sends notification</li>
            <li>• <strong>Real-time Updates:</strong> System automatically detects successful payments</li>
            <li>• <strong>Bank Integration:</strong> Links payment to booking via transaction ID</li>
            <li>• <strong>Confirmation:</strong> Payment received at smitbahadure90@oksbi ✅</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/bookings')}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <FileText className="h-5 w-5" />
            <span>View My Bookings</span>
          </button>
          <button
            onClick={() => navigate('/services')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Services</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
