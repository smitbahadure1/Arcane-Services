import React from 'react'
import { Star, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

interface ServiceCardProps {
  service: {
    id: string
    title: string
    description: string
    price: number
    image_url?: string
    rating?: number
    availability?: boolean
  }
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const resolveImageSrc = (url?: string) => {
    if (!url) return undefined
    if (url.startsWith('/')) {
      const base = (import.meta as any).env?.BASE_URL || '/'
      return `${base.replace(/\/$/, '')}/${url.replace(/^\//, '')}`
    }
    return url
  }

  const fallbackImage = 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=800'

  return (
    <Link to={`/service/${service.id}`} className="block group">
      <div className="card overflow-hidden group-hover:-translate-y-2 transition-all duration-300">
        <div className="relative h-56 overflow-hidden">
          <img
            src={resolveImageSrc(service.image_url) || fallbackImage}
            alt={service.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.currentTarget.src = fallbackImage
            }}
          />
          {!service.availability && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
              <span className="bg-error-500 text-white px-4 py-2 rounded-xl text-sm font-semibold">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>
        <div className="p-8">
          <h3 className="text-title mb-3 text-primary-900 group-hover:text-accent-600 transition-colors">
            {service.title}
          </h3>
          <p className="text-body text-primary-600 mb-6 line-clamp-2">{service.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-3xl font-bold text-accent-600">₹{service.price}</span>
              <div className="flex items-center space-x-1 text-caption text-primary-500">
                <Clock className="h-4 w-4" />
                <span>Starting from</span>
              </div>
            </div>
            
            {service.rating && (
              <div className="flex items-center space-x-1 bg-warning-100 px-3 py-1 rounded-xl">
                <Star className="h-4 w-4 text-warning-500 fill-current" />
                <span className="text-caption text-warning-700 font-semibold">{service.rating}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ServiceCard