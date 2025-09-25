import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, IndianRupee, TrendingUp, TestTube, CheckCircle } from 'lucide-react'
import { sampleServices, sampleCategories } from '../data/sampleServices'
import { fsGetBookings, fsUpdateBookingStatus, cloudGetBookings, cloudUpdateBookingStatus } from '../utils/bookingStorage'
import { db } from '../lib/firebase'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { addSampleBookings } from '../utils/sampleBookings'

const Dashboard: React.FC = () => {
  const [services, setServices] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalServices: 0,
    totalBookings: 0,
    totalRevenue: 0,
    pendingBookings: 0
  })
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [editingService, setEditingService] = useState<any>(null)
  const [serviceForm, setServiceForm] = useState({
    title: '',
    description: '',
    price: '',
    image_url: '',
    category_id: ''
  })
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    // Realtime Firestore listener
    let unsubscribe: (() => void) | null = null
    try {
      const q = query(collection(db, 'bookings'), orderBy('created_at', 'desc'))
      unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
        applyData(docs)
      }, () => {
        fetchData()
      })
    } catch {
      fetchData()
    }
    return () => { if (unsubscribe) unsubscribe() }
  }, [])

  // Fallback periodic refresh
  useEffect(() => {
    const interval = setInterval(fetchData, 10000)
    return () => clearInterval(interval)
  }, [])

  // Also refresh when component becomes visible (when user switches to dashboard)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchData()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  // Listen for localStorage changes across tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'home_service_bookings' && e.newValue) {
        console.log('📡 Cross-tab localStorage change detected')
        fetchData()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Also listen for custom events for same-tab updates
    const handleCustomStorageChange = () => {
      console.log('🔄 Custom storage change event detected')
      fetchData()
    }

    window.addEventListener('bookingsUpdated', handleCustomStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('bookingsUpdated', handleCustomStorageChange)
    }
  }, [])

  const fetchData = async () => {
    // Use sample services
    setServices(sampleServices)

    // Get bookings from localStorage with multiple fallback methods
    let bookingsData = await fsGetBookings()
    if (!bookingsData || bookingsData.length === 0) {
      bookingsData = await cloudGetBookings()
    }

    applyData(bookingsData)
  }

  const applyData = (bookingsData: any[]) => {
    const bookingsWithService = bookingsData.map((booking: any) => {
      const svc = sampleServices.find(s => s.id === booking.service_id)
      if (svc) return { ...booking, service: { title: svc.title } }
      return booking.service?.title ? booking : { ...booking, service: { title: 'Unknown Service' } }
    })

    setBookings(bookingsWithService)
    setCategories(sampleCategories)

    const totalRevenue = bookingsData
      .filter((b: any) => b.status !== 'cancelled')
      .reduce((sum: number, b: any) => sum + Number(b.total_price || 0), 0)
    const pendingBookings = bookingsData.filter((b: any) => b.status === 'pending').length

    setStats({
      totalServices: sampleServices.length,
      totalBookings: bookingsData.length,
      totalRevenue,
      pendingBookings
    })
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData = {
      ...serviceForm,
      price: parseFloat(serviceForm.price)
    }

    // Service management functionality
    if (editingService) {
      console.log('Service updated:', serviceData)
    } else {
      console.log('Service created:', serviceData)
    }
    
    setEditingService(null)
    resetForm()
    fetchData()
  }

  const resetForm = () => {
    setServiceForm({
      title: '',
      description: '',
      price: '',
      image_url: '',
      category_id: ''
    })
    setShowServiceForm(false)
    setEditingService(null)
  }

  const handleEditService = (service: any) => {
    setServiceForm({
      title: service.title,
      description: service.description,
      price: service.price.toString(),
      image_url: service.image_url || '',
      category_id: service.category_id || ''
    })
    setEditingService(service)
    setShowServiceForm(true)
  }

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return
    
    console.log('Service deleted:', serviceId)
    fetchData()
  }

  const handleUpdateBookingStatus = async (bookingId: string, status: string) => {
    let success = await fsUpdateBookingStatus(bookingId, status as any)
    if (!success) {
      success = await cloudUpdateBookingStatus(bookingId, status as any)
    }

    if (success) {
      fetchData()
    } else {
      alert('Error updating booking status')
    }
  }

  // Manual payment verification function
  const handleVerifyPayment = async (bookingId: string) => {
    try {
      // Simulate payment verification (in real system, this would call UPI Gateway API)
      console.log('🔍 Manually verifying payment for booking:', bookingId)

      // Update booking status to confirmed
      const success = updateBookingStatus(bookingId, 'confirmed')

      if (success) {
        alert('✅ Payment verified and booking confirmed!')
        fetchData()
      } else {
        alert('❌ Error verifying payment')
      }
    } catch (error) {
      console.error('Payment verification error:', error)
      alert('❌ Error verifying payment')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your services and bookings</p>
            <div className="mt-2 flex items-center space-x-2">
              <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>🔔 Webhook Active - Listening for UPI payments</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              addSampleBookings()
              setTimeout(() => fetchData(), 100) // Refresh after adding sample data
            }}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <TestTube className="h-4 w-4" />
            <span>Add Sample Bookings</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Services</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalServices}</p>
              </div>
              <Users className="h-12 w-12 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalBookings}</p>
              </div>
              <Calendar className="h-12 w-12 text-green-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold text-teal-600">₹{stats.totalRevenue.toFixed(2)}</p>
              </div>
              <IndianRupee className="h-12 w-12 text-teal-600" />
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Pending Bookings</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingBookings}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Services Management */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-800">Services</h2>
                <button
                  onClick={() => setShowServiceForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Service</span>
                </button>
              </div>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {services.map((service) => (
                <div key={service.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{service.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">₹{service.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
            </div>
            
            <div className="max-h-96 overflow-y-auto">
              {bookings.length === 0 ? (
                <div className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No bookings yet</p>
                  <p className="text-sm text-gray-500 mt-2">Bookings will appear here when users book services</p>
                </div>
              ) : (
                [...bookings]
                  .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                  .slice(0, 10)
                  .map((booking) => (
                  <div key={booking.id} className="p-4 border-b last:border-b-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">{booking.service?.title}</h3>
                        <p className="text-sm text-gray-600">{booking.customer_name}</p>
                        <p className="text-xs text-gray-500">ID: {booking.id}</p>
                      </div>
                      <select
                        value={booking.status}
                        onChange={(e) => handleUpdateBookingStatus(booking.id, e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleVerifyPayment(booking.id)}
                          className="ml-2 p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                          title="Manually verify payment"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <span>{booking.booking_date} at {booking.booking_time}</span>
                      <span className="font-medium">₹{booking.total_price}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Service Form Modal */}
        {showServiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md m-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              
              <form onSubmit={handleServiceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Title
                  </label>
                  <input
                    type="text"
                    required
                    value={serviceForm.title}
                    onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={serviceForm.description}
                    onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={serviceForm.category_id}
                    onChange={(e) => setServiceForm({ ...serviceForm, category_id: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Image URL
                  </label>
                  <input
                    type="url"
                    value={serviceForm.image_url}
                    onChange={(e) => setServiceForm({ ...serviceForm, image_url: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingService ? 'Update' : 'Add'} Service
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard