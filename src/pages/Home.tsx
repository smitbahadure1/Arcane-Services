import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Shield, Clock, Star, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-accent-800 text-white py-16 md:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/80 to-accent-800/60"></div>
        <div className="absolute inset-0 bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px]"></div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1 className="text-display mb-6 md:mb-8 text-white">
            Professional Home Services
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-12 text-primary-100 leading-relaxed">
            Connect with verified professionals for all your home service needs.
            Quality service, guaranteed satisfaction.
          </p>

          {/* Service region notice */}
          <div className="mb-8 md:mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-primary-50 shadow-lg">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-semibold tracking-wide">Now serving Maharashtra only</span>
              <span className="opacity-80">— Mumbai, Pune & beyond. येतोय लवकरच everywhere!</span>
            </div>
          </div>

          {/* Removed tagline image */}

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 md:mb-16">
            <Link
              to="/services"
              className="btn-primary text-lg px-8 py-4"
            >
              Browse Services
            </Link>
            {!user && (
              <Link
                to="/register"
                className="btn-secondary text-lg px-8 py-4"
              >
                Get Started
              </Link>
            )}
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
      </section>

      {/* Services Preview Section */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-headline text-gray-900 mb-4">Our Popular Services</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              We offer a wide range of professional home services to meet all your needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: '1', title: 'House Cleaning', price: '₹699', rating: 4.8, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
              { id: '2', title: 'Plumbing Repair', price: '₹499', rating: 4.9, image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400' },
              { id: '3', title: 'Electrical Work', price: '₹549', rating: 4.7, image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400' }
            ].map((service) => (
              <Link to={`/service/${service.id}`} key={service.id} className="card group block cursor-pointer">
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-title text-gray-900 mb-2">{service.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-accent-600">{service.price}</span>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600">{service.rating}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              to="/services"
              className="btn-primary text-lg px-8 py-4"
            >
              View All Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-headline text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              We provide the best home services with professional quality and reliable support
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: CheckCircle, title: 'Verified Professionals', desc: 'All our service providers are background checked and verified' },
              { icon: Users, title: 'Experienced Team', desc: 'Years of experience in providing quality home services' },
              { icon: Shield, title: 'Quality Guarantee', desc: '100% satisfaction guarantee on all our services' },
              { icon: Clock, title: '24/7 Support', desc: 'Round the clock customer support for your peace of mind' }
            ].map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-title text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-body text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section - hidden for signed-in users */}
      {!user && (
        <section className="py-16 md:py-24 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-headline mb-6">Ready to Get Started?</h2>
            <p className="text-lg mb-8 text-blue-100">
              Join thousands of satisfied customers who trust us with their home services
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors"
              >
                Create Account
              </Link>
              <Link
                to="/services"
                className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
              >
                Browse Services
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
