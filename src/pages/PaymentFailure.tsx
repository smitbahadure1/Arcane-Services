import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Home, RefreshCw, AlertTriangle } from 'lucide-react';

const PaymentFailure: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const error = searchParams.get('error') || 'Payment was cancelled or failed';

  const handleRetryPayment = () => {
    // Get the last booking data and redirect to retry
    const lastBooking = JSON.parse(localStorage.getItem('pending_booking') || 'null');
    if (lastBooking) {
      navigate(`/book/${lastBooking.serviceId}`);
    } else {
      navigate('/services');
    }
  };

  const handleContactSupport = () => {
    // In real system, this would open support chat or email
    alert('📞 Support Contact:\n\nPhone: +91-9876543210\nEmail: support@homeservice.com\n\nOur team will help resolve the payment issue.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Issue</h1>
          <p className="text-gray-600">We encountered an issue processing your payment</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800 mb-2">Issue Details:</h3>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h3 className="text-lg font-semibold text-gray-800">What can you do?</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• <strong>Try Again:</strong> Most payment issues are temporary</li>
              <li>• <strong>Check Network:</strong> Ensure stable internet connection</li>
              <li>• <strong>Contact Support:</strong> Get help from our team</li>
              <li>• <strong>Manual Verification:</strong> Admin can verify payment manually</li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-800 mb-2">Need Help?</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Our support team is available 24/7</li>
              <li>• Most issues are resolved within minutes</li>
              <li>• Your booking is saved and can be recovered</li>
              <li>• Manual payment verification is available</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={handleRetryPayment}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Payment Again</span>
          </button>
          <button
            onClick={handleContactSupport}
            className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
          >
            <span>📞 Contact Support</span>
          </button>
          <button
            onClick={() => navigate('/services')}
            className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Back to Services</span>
          </button>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 flex items-center justify-center space-x-2 mx-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailure;
