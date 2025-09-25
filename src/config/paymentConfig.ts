// Payment configuration - Add your UPI details here
export const PAYMENT_CONFIG = {
  // Replace this with your actual UPI ID (e.g., 'yourname@paytm', 'yourname@phonepe', etc.)
  UPI_ID: 'smitbahadure90@oksbi', // ✅ Your actual UPI ID

  // QR code will be generated dynamically from your UPI ID
  // No need for static image file - system generates QR code automatically
  QR_CODE_GENERATOR: true, // ✅ Use dynamic QR code generation

  // Your business/merchant name
  MERCHANT_NAME: 'Home Service Provider',

  // Your business contact details
  BUSINESS_PHONE: '9876543210',
  BUSINESS_EMAIL: 'smitbahadure90@example.com',

  // Payment settings
  CURRENCY: 'INR',
  PAYMENT_TIMEOUT: 300000, // 5 minutes in milliseconds
};

// Validation function to check if UPI ID is configured
export const isPaymentConfigured = (): boolean => {
  return PAYMENT_CONFIG.UPI_ID !== 'your-upi-id@paytm' &&
         PAYMENT_CONFIG.UPI_ID.length > 10;
};
