import React from 'react'

function Logo({ width = '40px' }) {
  return (
    <div 
      className="flex items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-bold shadow-lg"
      style={{ width, height: width }}
    >
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        className="w-6 h-6"
      >
        <path 
          d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z" 
          fill="currentColor"
        />
      </svg>
    </div>
  )
}

export default Logo