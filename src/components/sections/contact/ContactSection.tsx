'use client'

import { useRef } from 'react'
import MovingBlackhole from '@/components/animation/moving-blackhole/MovingBlackhole'
import ContactCard from '@/components/ui/ContactCard'

interface ContactSectionProps {
  className?: string
}

export default function ContactSection({ className = '' }: ContactSectionProps) {
  const blackholeRef = useRef<any>(null)

  const handleInputFocus = (inputElement: HTMLElement) => {
    if (blackholeRef.current) {
      const rect = inputElement.getBoundingClientRect()
      const x = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1
      const y = -((rect.top + rect.height / 2) / window.innerHeight) * 2 + 1
      
      blackholeRef.current.triggerEffect(x * 80, y * 80, 1.5)
    }
  }

  return (
    <section className={`relative min-h-screen flex items-center justify-center ${className} bg-[#d8d8d8]`} >
      <div className="absolute inset-0">
        <MovingBlackhole ref={blackholeRef} />
      </div>
      
      <div className="w-full max-w-md mx-auto px-6">
        <ContactCard onInputFocus={handleInputFocus} />
      </div>
    </section>
  )
}