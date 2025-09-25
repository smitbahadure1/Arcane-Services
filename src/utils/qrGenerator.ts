// Generate QR code for UPI ID: smitbahadure90@oksbi
// This creates a QR code that will work with any UPI scanner

const upiString = 'upi://pay?pa=smitbahadure90@oksbi&pn=Home%20Service%20Provider&am=10&cu=INR&tn=Service%20Booking%20Payment';

// In a real implementation, you would generate this QR code image
// For now, we'll create a placeholder that shows the UPI string
// You can replace this with your actual QR code image

export const generateQRCode = (upiId: string, amount: number = 10) => {
  const upiString = `upi://pay?pa=${upiId}&pn=Home%20Service%20Provider&am=${amount}&cu=INR&tn=Service%20Booking%20Payment`;
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;
};
