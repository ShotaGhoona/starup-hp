'use client'

import { useState, useEffect } from 'react'
import { ServiceCardOption } from '@/data/service/service'

interface ExpandingCardsProps {
  className?: string
  options?: ServiceCardOption[]
}


export default function ExpandingCards({ className = '', options = [] }: ExpandingCardsProps) {
  const [activeCard, setActiveCard] = useState<number>(1)
  const [windowWidth, setWindowWidth] = useState<number>(0)

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }
    
    // Set initial width
    handleResize()
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleCardClick = (cardId: number) => {
    setActiveCard(cardId)
  }

  return (
    <div className={`flex flex-row justify-center items-center overflow-hidden font-sans transition-all duration-300 ${className}`}>
      <div className="flex flex-row items-stretch overflow-hidden min-w-[600px] max-w-7xl w-[calc(100%-100px)] h-[480px] sm:min-w-[520px] md:min-w-[440px] lg:min-w-[360px]">
        {options.map((option, index) => {
          // Responsive hiding logic for larger containers
          const shouldHide = 
            (windowWidth <= 1200 && index >= 5) ||
            (windowWidth <= 1024 && index >= 4) ||
            (windowWidth <= 798 && index >= 3) ||
            (windowWidth <= 638 && index >= 2) ||
            (windowWidth <= 480 && index >= 1)
          
          if (shouldHide) return null
          
          return (
          <div
            key={option.id}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)]
              ${activeCard === option.id 
                ? 'flex-grow-[10000] m-0 rounded-[40px]' 
                : 'flex-grow min-w-[60px] m-2.5 rounded-[30px]'
              }
            `}
            style={{
              backgroundImage: `url(${option.backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: option.defaultColor
            }}
            onClick={() => handleCardClick(option.id)}
          >
            {/* Shadow overlay */}
            <div
              className={`
                absolute left-0 right-0 h-[120px] transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)]
                ${activeCard === option.id 
                  ? 'bottom-0 shadow-[inset_0_-120px_120px_-120px_black,inset_0_-120px_120px_-100px_black]'
                  : 'bottom-[-40px] shadow-[inset_0_-120px_0px_-120px_black,inset_0_-120px_0px_-100px_black]'
                }
              `}
            />
            
            {/* Label */}
            <div
              className={`
                absolute right-0 flex h-10 transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)]
                ${activeCard === option.id ? 'bottom-5 left-5' : 'bottom-2.5 left-2.5'}
              `}
            >
              {/* Info */}
              <div className="flex flex-col justify-center text-white whitespace-pre">
                <div
                  className={`
                    relative font-bold text-lg transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)]
                    ${activeCard === option.id ? 'left-0 opacity-100' : 'left-5 opacity-0'}
                  `}
                >
                  {option.title}
                </div>
                <div
                  className={`
                    relative transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)] delay-100
                    ${activeCard === option.id ? 'left-0 opacity-100' : 'left-5 opacity-0'}
                  `}
                >
                  {option.subtitle}
                </div>
              </div>
            </div>
          </div>
          )
        })}
      </div>
    </div>
  )
}