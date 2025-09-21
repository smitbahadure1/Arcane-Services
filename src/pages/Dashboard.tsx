import React, { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Users, Calendar, IndianRupee, TrendingUp } from 'lucide-react'
import { supabase } from '../lib/supabase'

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
    fetchData()
  }, [])

  const fetchData = async () => {
    // Fetch services
    const { data: servicesData } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch bookings
    const { data: bookingsData } = await supabase
      .from('bookings')
      .select(`
        *,
        services(title)
      `)
      .order('created_at', { ascending: false })

    // Fetch categories
    const { data: categoriesData } = await supabase
      .from('service_categories')
      .select('*')
      .order('name')

    if (servicesData) {
      setServices(servicesData)
      setStats(prev => ({ ...prev, totalServices: servicesData.length }))
    }

    if (bookingsData) {
      setBookings(bookingsData)
      const totalRevenue = bookingsData
        .filter(b => b.status !== 'cancelled')
        .reduce((sum, booking) => sum + parseFloat(booking.total_price), 0)
      const pendingBookings = bookingsData.filter(b => b.status === 'pending').length

      setStats(prev => ({
        ...prev,
        totalBookings: bookingsData.length,
        totalRevenue,
        pendingBookings
      }))
    }

    if (categoriesData) {
      setCategories(categoriesData)
    }
  }

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData = {
      ...serviceForm,
      price: parseFloat(serviceForm.price)
    }

    if (editingService) {
      const { error } = await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id)
      
      if (!error) {
        setEditingService(null)
        resetForm()
        fetchData()
      }
    } else {
      const { error } = await supabase
        .from('services')
        .insert([serviceData])
      
      if (!error) {
        resetForm()
        fetchData()
      }
    }
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

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', serviceId)

    if (!error) {
      fetchData()
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId)

    if (!error) {
      fetchData()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your services and bookings</p>
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
              {bookings.slice(0, 10).map((booking) => (
                <div key={booking.id} className="p-4 border-b last:border-b-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-800">{booking.services?.title}</h3>
                      <p className="text-sm text-gray-600">{booking.customer_name}</p>
                    </div>
                    <select
                      value={booking.status}
                      onChange={(e) => updateBookingStatus(booking.id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{booking.booking_date} at {booking.booking_time}</span>
                    <span className="font-medium">₹{booking.total_price}</span>
                  </div>
                </div>
              ))}
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