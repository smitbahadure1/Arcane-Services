import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Filter, Grid, List } from 'lucide-react'
import { supabase } from '../lib/supabase'
import ServiceCard from '../components/ServiceCard'

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('rating')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    fetchCategories()
    fetchServices()
  }, [selectedCategory, sortBy])

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('service_categories')
      .select('*')
      .order('name')

    if (data) setCategories(data)
  }

  const fetchServices = async () => {
    setLoading(true)
    let query = supabase
      .from('services')
      .select('*')
      .eq('availability', true)

    if (selectedCategory) {
      query = query.eq('category_id', selectedCategory)
    }

    if (sortBy === 'rating') {
      query = query.order('rating', { ascending: false })
    } else if (sortBy === 'price_low') {
      query = query.order('price', { ascending: true })
    } else if (sortBy === 'price_high') {
      query = query.order('price', { ascending: false })
    }

    const { data } = await query

    if (data) {
      setServices(data)
    }
    setLoading(false)
  }


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-accent-50 to-success-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-4">
            All Services
          </h1>
          <p className="text-lg text-primary-600 max-w-2xl mx-auto">
            Find the perfect service for your home from our trusted professionals
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-primary-100 sticky top-24">
              <div className="flex items-center space-x-2 mb-6">
                <div className="p-2 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg">
                  <Filter className="h-5 w-5 text-white" />
                </div>
                <h2 className="text-lg font-semibold bg-gradient-to-r from-primary-700 to-accent-700 bg-clip-text text-transparent">
                  Filters
                </h2>
              </div>

              {/* Categories Filter */}
              <div className="mb-6">
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-accent-500 to-primary-500 rounded-full mr-2"></div>
                  Categories
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-primary-50 transition-colors">
                    <input
                      type="radio"
                      name="category"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-primary-700 font-medium">All Categories</span>
                  </label>
                  {categories.map((category, index) => (
                    <label key={category.id} className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-primary-50 transition-colors">
                      <input
                        type="radio"
                        name="category"
                        value={category.id}
                        checked={selectedCategory === category.id}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-primary-700 font-medium">{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>


              {/* Sort By */}
              <div>
                <h3 className="font-semibold text-primary-800 mb-4 flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-success-500 to-accent-500 rounded-full mr-2"></div>
                  Sort By
                </h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-3 border border-primary-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white shadow-sm text-primary-700 font-medium"
                >
                  <option value="rating">⭐ Highest Rated</option>
                  <option value="price_low">💰 Price: Low to High</option>
                  <option value="price_high">💎 Price: High to Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Services Grid */}
          <div className="lg:w-3/4">
            <div className="flex items-center justify-between mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-primary-100">
              <p className="text-primary-700 font-medium">
                Showing <span className="font-bold text-accent-600">{services.length}</span> service{services.length !== 1 ? 's' : ''}
              </p>
              
              <div className="flex items-center space-x-2 bg-primary-50 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'grid' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md' : 'text-primary-600 hover:bg-primary-100'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all duration-200 ${viewMode === 'list' ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md' : 'text-primary-600 hover:bg-primary-100'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>

            {services.length === 0 && (
              <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-primary-100">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-10 w-10 text-primary-500" />
                </div>
                <p className="text-primary-600 text-lg font-medium">No services found matching your criteria.</p>
                <p className="text-primary-500 mt-2">Try adjusting your filters to see more results.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Services