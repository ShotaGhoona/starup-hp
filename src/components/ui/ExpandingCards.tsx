'use client'

import { useState, useEffect } from 'react'

interface CardOption {
  id: number
  title: string
  subtitle: string
  icon: string
  backgroundImage: string
  defaultColor: string
}

interface ExpandingCardsProps {
  className?: string
  options?: CardOption[]
}

const defaultOptions: CardOption[] = [
  {
    id: 1,
    title: "Blonkisoaz",
    subtitle: "Omuke trughte a otufta",
    icon: "🚶",
    backgroundImage: "https://66.media.tumblr.com/6fb397d822f4f9f4596dff2085b18f2e/tumblr_nzsvb4p6xS1qho82wo1_1280.jpg",
    defaultColor: "#ED5565"
  },
  {
    id: 2,
    title: "Oretemauw",
    subtitle: "Omuke trughte a otufta",
    icon: "❄️",
    backgroundImage: "https://66.media.tumblr.com/8b69cdde47aa952e4176b4200052abf4/tumblr_o51p7mFFF21qho82wo1_1280.jpg",
    defaultColor: "#FC6E51"
  },
  {
    id: 3,
    title: "Iteresuselle",
    subtitle: "Omuke trughte a otufta",
    icon: "🌲",
    backgroundImage: "https://66.media.tumblr.com/5af3f8303456e376ceda1517553ba786/tumblr_o4986gakjh1qho82wo1_1280.jpg",
    defaultColor: "#FFCE54"
  },
  {
    id: 4,
    title: "Idiefe",
    subtitle: "Omuke trughte a otufta",
    icon: "💧",
    backgroundImage: "https://66.media.tumblr.com/5516a22e0cdacaa85311ec3f8fd1e9ef/tumblr_o45jwvdsL11qho82wo1_1280.jpg",
    defaultColor: "#2ECC71"
  },
  {
    id: 5,
    title: "Inatethi",
    subtitle: "Omuke trughte a otufta",
    icon: "☀️",
    backgroundImage: "https://66.media.tumblr.com/f19901f50b79604839ca761cd6d74748/tumblr_o65rohhkQL1qho82wo1_1280.jpg",
    defaultColor: "#5D9CEC"
  }
]

export default function ExpandingCards({ className = '', options = defaultOptions }: ExpandingCardsProps) {
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
    <div className={`flex flex-row justify-center items-center overflow-hidden min-h-screen font-sans transition-all duration-300 ${className}`}>
      <div className="flex flex-row items-stretch overflow-hidden min-w-[600px] max-w-[900px] w-[calc(100%-100px)] h-[400px] sm:min-w-[520px] md:min-w-[440px] lg:min-w-[360px]">
        {options.map((option, index) => {
          // Responsive hiding logic
          const shouldHide = 
            (windowWidth <= 798 && index >= 4) ||
            (windowWidth <= 718 && index >= 3) ||
            (windowWidth <= 638 && index >= 2) ||
            (windowWidth <= 558 && index >= 1)
          
          if (shouldHide) return null
          
          return (
          <div
            key={option.id}
            className={`
              relative overflow-hidden cursor-pointer transition-all duration-500 ease-[cubic-bezier(0.05,0.61,0.41,0.95)]
              ${activeCard === option.id 
                ? 'flex-grow-[10000] max-w-[600px] m-0 rounded-[40px] bg-[length:auto_100%]' 
                : 'flex-grow min-w-[60px] m-2.5 rounded-[30px] bg-[length:auto_120%]'
              }
            `}
            style={{
              backgroundImage: `url(${option.backgroundImage})`,
              backgroundSize: activeCard === option.id ? 'auto 100%' : 'auto 120%',
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
              {/* Icon */}
              <div
                className="flex flex-row justify-center items-center min-w-10 max-w-10 h-10 rounded-full bg-white text-2xl"
                style={{ color: option.defaultColor }}
              >
                {option.icon}
              </div>
              
              {/* Info */}
              <div className="flex flex-col justify-center ml-2.5 text-white whitespace-pre">
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