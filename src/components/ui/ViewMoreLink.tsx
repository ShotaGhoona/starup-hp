'use client'

import React from 'react'
import { useRouter } from 'next/navigation'

interface ViewMoreLinkProps {
  href: string
  className?: string
}

const ViewMoreLink: React.FC<ViewMoreLinkProps> = ({ href, className = '' }) => {
  const router = useRouter()

  const handleClick = () => {
    // トランジションイベントを発火
    window.dispatchEvent(new CustomEvent('startPageTransition', { detail: { href } }))
    
    // 300ms後にナビゲーション
    setTimeout(() => {
      router.push(href)
    }, 300)
  }

  return (
    <div className={`text-right mt-4 md:mt-6 lg:mt-8 ${className}`}>
      <button
        onClick={handleClick}
        className="group inline-flex items-center gap-2 md:gap-3 text-gray-700 hover:text-[#002AF4] transition-colors duration-200 font-semibold text-sm md:text-base lg:text-lg"
      >
        <span className="relative">
          View More
          <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#002AF4] transition-all duration-300 group-hover:w-full"></span>
        </span>
        <svg 
          className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-200 group-hover:translate-x-1" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2.5} 
            d="M17 8l4 4m0 0l-4 4m4-4H3" 
          />
        </svg>
      </button>
    </div>
  )
}

export default ViewMoreLink