'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import SpaceBackgroundFooter from '@/components/animation/background-animation/SpaceBackgroundFooter'

const Footer = () => {
  const quickLinks = [
    { name: 'Service', href: '/service' },
    { name: 'About', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact', href: '/contact' }
  ]

  const socialLinks = [
    { 
      name: 'X (Twitter)', 
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      name: 'note', 
      href: '#',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 40 40">
          <path d="M20 0C8.95 0 0 8.95 0 20s8.95 20 20 20 20-8.95 20-20S31.05 0 20 0zm-6.67 30c-2.1 0-3.83-1.73-3.83-3.83V13.83c0-2.1 1.73-3.83 3.83-3.83h13.34c2.1 0 3.83 1.73 3.83 3.83v12.34c0 2.1-1.73 3.83-3.83 3.83H13.33z"/>
          <path d="M13.33 12.5c-.73 0-1.33.6-1.33 1.33v12.34c0 .73.6 1.33 1.33 1.33h13.34c.73 0 1.33-.6 1.33-1.33V13.83c0-.73-.6-1.33-1.33-1.33H13.33z" fill="white"/>
        </svg>
      )
    }
  ]

  return (
    <footer className="relative bg-black border-t border-gray-800 overflow-hidden">
      <SpaceBackgroundFooter />
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
        
        {/* Main content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Company brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <Image 
                src="/icons/starup-logo-white.svg" 
                alt="STARUP Logo" 
                width={32} 
                height={32}
                className="w-8 h-8"
              />
              <span className="text-2xl font-bold text-white">
                STAR UP
              </span>
            </div>
            <p className="text-gray-300 text-lg leading-relaxed mb-8 max-w-md">
              宇宙に新しい常識を
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-gray-300 hover:bg-[#002AF4] hover:text-white transition-colors duration-200"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <nav className="space-y-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="block text-gray-300 hover:text-[#7A83FA] transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <div className="space-y-4">
              <div>
                <p className="text-white font-medium mb-1">京都本社</p>
                <p className="text-sm text-gray-300 leading-relaxed">
                  〒602-8061<br />
                  京都府京都市上京区油小路通中立売下る甲斐守町９７<br />
                  西陣産業創造會館 109
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gray-700 mb-8"></div>

        {/* Bottom section */}
        <div className="flex justify-center items-center">
          <p className="text-sm text-gray-400">
            © 2024 STARUP Inc. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer