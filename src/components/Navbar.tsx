import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, User, LogIn, LogOut, Settings, Calendar, Menu, X } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

const Navbar: React.FC = () => {
  const { user, signOut, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    setIsMobileMenuOpen(false)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Layout */}
        <div className="md:hidden">
          <div className="flex justify-between items-center h-16">
            <Link 
              to="/" 
              className="flex items-center space-x-2 text-lg font-bold text-slate-900 hover:text-blue-600 transition-colors"
              onClick={closeMobileMenu}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Home className="h-4 w-4 text-white" />
              </div>
              <span>ServiceHub</span>
            </Link>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-600 transition-colors"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40">
              <div className="px-4 py-4 space-y-4">
                {/* Navigation Links */}
                <Link
                  to="/services"
                  className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                  onClick={closeMobileMenu}
                >
                  <Home className="h-5 w-5" />
                  <span>Services</span>
                </Link>

                {user && (
                  <Link
                    to="/bookings"
                    className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    <Calendar className="h-5 w-5" />
                    <span>My Bookings</span>
                  </Link>
                )}

                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                    onClick={closeMobileMenu}
                  >
                    <Settings className="h-5 w-5" />
                    <span>Dashboard</span>
                  </Link>
                )}

                {/* User Section */}
                {user ? (
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <User className="h-5 w-5 text-slate-600" />
                      <span className="text-sm font-medium text-slate-600">{user.email}</span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center space-x-3 text-red-600 hover:text-red-700 font-medium transition-colors py-2"
                    >
                      <LogOut className="h-5 w-5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Link
                      to="/login"
                      className="flex items-center space-x-3 text-slate-700 hover:text-blue-600 font-medium transition-colors py-2"
                      onClick={closeMobileMenu}
                    >
                      <LogIn className="h-5 w-5" />
                      <span>Sign In</span>
                    </Link>
                    <Link
                      to="/register"
                      className="flex items-center space-x-3 bg-blue-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <User className="h-5 w-5" />
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex justify-between items-center h-20">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 text-2xl font-bold text-slate-900 hover:text-blue-600 transition-colors">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                <Home className="h-6 w-6 text-white" />
              </div>
              <span>ServiceHub</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/services" className="text-slate-700 hover:text-blue-600 font-medium transition-colors">
              Services
            </Link>
            {user && (
              <Link to="/bookings" className="text-slate-700 hover:text-blue-600 font-medium transition-colors flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>My Bookings</span>
              </Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2 text-slate-600">
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">{user.email}</span>
                </div>
                {isAdmin && (
                  <Link
                    to="/dashboard"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="flex items-center space-x-2 text-slate-600 hover:text-red-600 transition-colors font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="flex items-center space-x-2 text-slate-700 hover:text-blue-600 transition-colors font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar