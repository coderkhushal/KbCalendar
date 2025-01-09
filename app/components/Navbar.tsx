import React from 'react'

const Navbar = () => {
  return (
     <nav className="bg-indigo-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="text-white text-xl font-bold">KBCalendar</span>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              

              
            </div>
          </div>
          
        </div>
      </div>

    </nav>
  )
}

export default Navbar