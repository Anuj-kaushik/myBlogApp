import React, { useState } from 'react'
import { Container, Logo, LogoutBtn } from '../index'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const userData = useSelector((state) => state.auth.userData)
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    {
      name: 'Home',
      slug: "/",
      active: true
    }, 
    {
      name: "Login",
      slug: "/login",
      active: !authStatus,
    },
    {
      name: "Signup",
      slug: "/signup",
      active: !authStatus,
    },
    {
      name: "All Posts",
      slug: "/all-posts",
      active: authStatus,
    },
    {
      name: "Add Post",
      slug: "/add-post",
      active: authStatus,
    },
  ]

  return (
    <header className='sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200'>
      <Container>
        <nav className='flex items-center justify-between py-4'>
          {/* Logo Section */}
          <div className='flex items-center space-x-4'>
            <Link to='/' className='flex items-center space-x-2 group'>
              <Logo width='40px' />
              <span className='text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors'>
                BlogSpace
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center space-x-1'>
            {navItems.map((item) => 
              item.active ? (
                <button
                  key={item.name}
                  onClick={() => navigate(item.slug)}
                  className='px-4 py-2 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium'
                >
                  {item.name}
                </button>
              ) : null
            )}
            
            {authStatus && (
              <div className='flex items-center space-x-3 ml-4 pl-4 border-l border-gray-200'>
                <span className='text-sm text-gray-600'>
                  Welcome, {userData?.name || 'User'}
                </span>
                <LogoutBtn />
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors'
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className='md:hidden py-4 border-t border-gray-200 bg-white'>
            <div className='flex flex-col space-y-2'>
              {navItems.map((item) => 
                item.active ? (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.slug)
                      setIsMenuOpen(false)
                    }}
                    className='text-left px-4 py-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 font-medium'
                  >
                    {item.name}
                  </button>
                ) : null
              )}
              
              {authStatus && (
                <div className='px-4 py-2 border-t border-gray-100 mt-2 pt-4'>
                  <p className='text-sm text-gray-600 mb-3'>
                    Welcome, {userData?.name || 'User'}
                  </p>
                  <LogoutBtn />
                </div>
              )}
            </div>
          </div>
        )}
      </Container>
    </header>
  )
}

export default Header