import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Star, Clock, Shield, Users, Calendar, ArrowLeft } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { sampleServices, sampleCategories } from '../data/sampleServices'

const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (id) {
      fetchService(id)
    }
  }, [id])

  const fetchService = async (serviceId: string) => {
    // Find service in sample data
    const foundService = sampleServices.find(s => s.id === serviceId)
    
    if (foundService) {
      // Add category name to service
      const category = sampleCategories.find(c => c.id === foundService.category_id)
      const serviceWithCategory = {
        ...foundService,
        service_categories: category ? { name: category.name } : null
      }
      setService(serviceWithCategory)
    }
    setLoading(false)
  }

  const handleBookNow = () => {
    if (!user) {
      navigate('/login', { state: { from: `/service/${id}` } })
      return
    }
    navigate(`/book/${id}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Service Not Found</h2>
          <button
            onClick={() => navigate('/services')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Services
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-8 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Service Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-64 md:h-96 overflow-hidden">
                <img
                  src={service.image_url || 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800'}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                    {service.service_categories?.name}
                  </span>
                  {service.rating && (
                    <div className="flex items-center space-x-1">
                      <Star className="h-5 w-5 text-yellow-400 fill-current" />
                      <span className="font-medium text-gray-700">{service.rating}</span>
                      <span className="text-gray-500">(125 reviews)</span>
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-800 mb-4">{service.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">{service.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                    <div>
                      <p className="font-medium text-gray-800">Quick Service</p>
                      <p className="text-sm text-gray-600">Same day booking</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Shield className="h-6 w-6 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-800">Verified Pro</p>
                      <p className="text-sm text-gray-600">Licensed & insured</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-800">Experienced</p>
                      <p className="text-sm text-gray-600">5+ years experience</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">What's Included</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li>• Professional consultation and assessment</li>
                    <li>• All necessary tools and equipment</li>
                    <li>• Quality materials (if applicable)</li>
                    <li>• Clean-up after service completion</li>
                    <li>• 30-day service guarantee</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  ₹{service.price}
                </div>
                <p className="text-gray-600">Starting price</p>
              </div>

              {service.availability ? (
                <button
                  onClick={handleBookNow}
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Book Now</span>
                </button>
              ) : (
                <button
                  disabled
                  className="w-full bg-gray-400 text-white py-4 px-6 rounded-lg font-semibold cursor-not-allowed"
                >
                  Currently Unavailable
                </button>
              )}

              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response time</span>
                  <span className="font-medium">Within 2 hours</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Service guarantee</span>
                  <span className="font-medium">30 days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Cancellation</span>
                  <span className="font-medium">24h free</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✓ 100% satisfaction guarantee
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Book with confidence. If you're not happy, we'll make it right.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceDetail