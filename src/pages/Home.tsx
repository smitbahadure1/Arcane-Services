import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Wrench, Zap, Sparkles, Wind, Leaf, Paintbrush2, ArrowRight, Users, Shield, Clock } from 'lucide-react'
import ServiceCard from '../components/ServiceCard'
import { sampleServices, sampleCategories } from '../data/sampleServices'

const Home: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([])
  const [featuredServices, setFeaturedServices] = useState<any[]>([])

  useEffect(() => {
    fetchCategories()
    fetchFeaturedServices()
  }, [])

  const fetchCategories = async () => {
    setCategories(sampleCategories.slice(0, 6))
  }

  const fetchFeaturedServices = async () => {
    const sortedServices = [...sampleServices]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 6)
    setFeaturedServices(sortedServices)
  }


  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'Wrench': <Wrench className="h-8 w-8" />,
      'Zap': <Zap className="h-8 w-8" />,
      'Sparkles': <Sparkles className="h-8 w-8" />,
      'Wind': <Wind className="h-8 w-8" />,
      'Leaf': <Leaf className="h-8 w-8" />,
      'Paintbrush2': <Paintbrush2 className="h-8 w-8" />
    }
    return iconMap[iconName] || <Wrench className="h-8 w-8" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-success-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-accent-800/60"></div>
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-display mb-6 md:mb-8 text-white">
              Professional Home Services
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-primary-100 leading-relaxed">
              Connect with verified professionals for all your home service needs. 
              Quality service, guaranteed satisfaction.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
              <Link 
                to="/services" 
                className="btn-primary text-lg px-8 py-4"
              >
                Browse Services
              </Link>
              <Link 
                to="/register" 
                className="btn-secondary text-lg px-8 py-4"
              >
                Get Started
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-white/90 max-w-3xl mx-auto">
              <div className="flex flex-col items-center space-y-3 group">
                <div className="w-16 h-16 bg-gradient-to-br from-accent-400/30 to-accent-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-accent-300/20">
                  <Users className="h-8 w-8 text-accent-300" />
                </div>
                <span className="text-caption font-medium">10,000+ Customers</span>
              </div>
              <div className="flex flex-col items-center space-y-3 group">
                <div className="w-16 h-16 bg-gradient-to-br from-success-400/30 to-success-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-success-300/20">
                  <Shield className="h-8 w-8 text-success-300" />
                </div>
                <span className="text-caption font-medium">Verified Professionals</span>
              </div>
              <div className="flex flex-col items-center space-y-3 group">
                <div className="w-16 h-16 bg-gradient-to-br from-warning-400/30 to-warning-500/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border border-warning-300/20">
                  <Clock className="h-8 w-8 text-warning-300" />
                </div>
                <span className="text-caption font-medium">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-24 bg-gradient-to-br from-white via-primary-50/30 to-accent-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent mb-6">
              Service Categories
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Choose from our comprehensive range of professional home services
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => {
              const colors = [
                'from-primary-400 to-primary-600',
                'from-accent-400 to-accent-600', 
                'from-success-400 to-success-600',
                'from-warning-400 to-warning-600',
                'from-purple-400 to-purple-600',
                'from-pink-400 to-pink-600'
              ]
              const colorClass = colors[index % colors.length]
              
              return (
                <Link
                  key={category.id}
                  to={`/services?category=${category.id}`}
                  className="group relative overflow-hidden"
                >
                  <div className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100 text-center group-hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl">
                    <div className={`w-20 h-20 bg-gradient-to-br ${colorClass} rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <div className="text-white">
                        {getIconComponent(category.icon)}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-900 group-hover:text-primary-700 transition-colors">
                      {category.name}
                    </h3>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24 bg-gradient-to-br from-accent-50/50 via-white to-success-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-16">
            <div className="mb-6 sm:mb-0">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-accent-700 to-success-600 bg-clip-text text-transparent mb-4">
                Featured Services
              </h2>
              <p className="text-xl text-primary-600">Top-rated services from verified professionals</p>
            </div>
            <Link
              to="/services"
              className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-primary-600 hover:to-accent-600 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <span>View All Services</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-gradient-to-br from-primary-50 via-white to-accent-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent mb-6">
              How It Works
            </h2>
            <p className="text-xl text-primary-600 max-w-2xl mx-auto">
              Get your home services booked in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100">
                <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  1
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary-900">Search & Choose</h3>
                <p className="text-primary-600 leading-relaxed">Browse our categories and find the perfect service for your needs</p>
              </div>
            </div>
            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-accent-100/50 to-success-100/50 rounded-3xl transform -rotate-3 group-hover:-rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100">
                <div className="w-24 h-24 bg-gradient-to-br from-accent-500 to-accent-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  2
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary-900">Book & Schedule</h3>
                <p className="text-primary-600 leading-relaxed">Select your preferred date and time, then confirm your booking</p>
              </div>
            </div>
            <div className="text-center group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-success-100/50 to-warning-100/50 rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-300"></div>
              <div className="relative bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-primary-100">
                <div className="w-24 h-24 bg-gradient-to-br from-success-500 to-success-600 text-white rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl font-bold shadow-xl group-hover:scale-110 transition-transform duration-300">
                  3
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-primary-900">Relax & Enjoy</h3>
                <p className="text-primary-600 leading-relaxed">Sit back while our verified professional takes care of your needs</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home