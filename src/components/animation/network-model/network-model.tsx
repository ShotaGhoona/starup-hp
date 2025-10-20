'use client'

import { useEffect, useState } from 'react'

interface NetworkModelProps {
  className?: string
}

export default function NetworkModel({ className = '' }: NetworkModelProps) {
  const [time, setTime] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => prev + 0.1)
    }, 50) // 20fps for smooth animation

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" className="w-full h-full max-w-[800px] max-h-[600px]">
  
        {/* Network nodes */}
        <g>
          <circle cx="150" cy="150" r="6" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="350" cy="100" r="8" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="550" cy="150" r="6" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="100" cy="300" r="7" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="350" cy="250" r="10" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="600" cy="300" r="7" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="200" cy="450" r="6" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
          <circle cx="500" cy="450" r="6" fill="rgba(122, 131, 250, 0.8)" stroke="#fff" strokeWidth="2"/>
        </g>

        {/* Animated connection lines */}
        <g>
          <line x1="150" y1="150" x2="350" y2="100" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -10}
                strokeLinecap="round"/>
          
          <line x1="350" y1="100" x2="550" y2="150" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -8}
                strokeLinecap="round"/>
          
          <line x1="100" y1="300" x2="350" y2="250" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -12}
                strokeLinecap="round"/>
          
          <line x1="350" y1="250" x2="600" y2="300" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -15}
                strokeLinecap="round"/>
          
          <line x1="150" y1="150" x2="100" y2="300" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -6}
                strokeLinecap="round"/>
          
          <line x1="550" y1="150" x2="600" y2="300" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -9}
                strokeLinecap="round"/>
          
          <line x1="200" y1="450" x2="350" y2="250" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -14}
                strokeLinecap="round"/>
          
          <line x1="350" y1="250" x2="500" y2="450" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -11}
                strokeLinecap="round"/>
          
          <line x1="100" y1="300" x2="200" y2="450" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -7}
                strokeLinecap="round"/>
          
          <line x1="500" y1="450" x2="600" y2="300" 
                stroke="rgba(122, 131, 250, 0.8)" 
                strokeWidth="2" 
                strokeDasharray="10,5" 
                strokeDashoffset={time * -13}
                strokeLinecap="round"/>
        </g>

      </svg>
    </div>
  )
}