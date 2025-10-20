'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import SpaceBackgroundFooter from '@/components/animation/background-animation/SpaceBackgroundFooter'
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
    <section className={`relative h-screen flex items-center ${className} bg-[#d8d8d8]`} >
      <div className="absolute inset-0">
        <SpaceBackgroundFooter/>
      </div>
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left side - Logo and text */}
        <div className="relative z-20 flex flex-col items-start space-y-6">
          {/* Breadcrumb */}
          <nav className="mb-5" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-white/80">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <ChevronRight size={16} className="text-white/60" />
              </li>
              <li className="text-white font-medium">
                Contact
              </li>
            </ol>
          </nav>

          <div className="flex items-center space-x-4">
            <img 
              src="/icons/starup-logo-white.svg" 
              alt="STARUP Logo" 
              className="w-16 h-16"
            />
            <h1 className="text-4xl lg:text-5xl font-bold text-white">
              STAR UP
            </h1>
          </div>
          <p className="text-lg lg:text-xl text-white/90">
            宇宙に新しい常識を。
          </p>
        </div>
        
        {/* Right side - Contact form */}
        <div className="relative z-20 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
          <ContactCard onInputFocus={handleInputFocus} />
        </div>
      </div>
    </section>
  )
}