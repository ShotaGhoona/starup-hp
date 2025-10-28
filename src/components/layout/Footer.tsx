'use client'

import TransitionLink from '@/components/ui/TransitionLink'
import Image from 'next/image'
import { companySNS } from '@/data/company'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const logoRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLParagraphElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (logoRef.current && textRef.current && svgRef.current) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: logoRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play reset none reset',
        }
      })

      // グラデーションの色を取得
      const gradientStop1 = svgRef.current.querySelector('#logoGradient stop:first-child')
      const gradientStop2 = svgRef.current.querySelector('#logoGradient stop:last-child')

      tl.fromTo(
        logoRef.current,
        {
          scaleY: 2.4,
          y: 200,
          transformOrigin: 'top center',
        },
        {
          scaleY: 1,
          y: 0,
          duration: 0.5,
          ease: 'power2.out',
          transformOrigin: 'top center',
        }
      )

      tl.fromTo(
        textRef.current,
        {
          opacity: 0,
          y: 10,
        },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
        },
        '-=0.2'
      )

      // アニメーション完了後、グラデーションの色を変更
      if (gradientStop1 && gradientStop2) {
        tl.to(
          gradientStop1,
          {
            stopColor: '#8B5CF6',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '+=0.2'
        )

        tl.to(
          gradientStop2,
          {
            stopColor: '#06B6D4',
            duration: 0.8,
            ease: 'power2.inOut',
          },
          '<'
        )
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <footer className="bg-gray-100 pt-12 md:pt-16 pb-8 relative overflow-hidden">
      <div className="max-w-[1500px] mx-auto px-4 pb-16">
        {/* Mobile Layout */}
        <div className="block md:hidden space-y-8">
          {/* Contact & Career Buttons First */}
          <div className="space-y-4">
            <TransitionLink 
              href="/contact" 
              className="group flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-full hover:bg-orange-600 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <div className="bg-white text-orange-500 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">お気軽にご相談ください</p>

            <TransitionLink 
              href="/recruit" 
              className="group flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-full hover:bg-gray-900 transition-colors"
            >
              <span className="font-medium">Career</span>
              <div className="bg-white text-gray-800 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">一緒に働きませんか</p>
          </div>

          {/* Navigation Links */}
          <div className="grid grid-cols-2 gap-8">
            {/* Explore */}
            <div>
              <h3 className="text-base font-medium text-gray-500 mb-3">Explore</h3>
              <div className="space-y-2">
                <TransitionLink href="/about" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  About
                </TransitionLink>
                <TransitionLink href="/member" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Member
                </TransitionLink>
                <TransitionLink href="/news" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  News
                </TransitionLink>
                <TransitionLink href="/recruit" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Career
                </TransitionLink>
                <TransitionLink href="/contact" className="block text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  Contact
                </TransitionLink>
              </div>
            </div>

            {/* Follow us */}
            <div>
              <h3 className="text-base font-medium text-gray-500 mb-3">Follow us</h3>
              <div className="space-y-2">
                <a href={companySNS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                  @starup01
                </a>
                <a href={companySNS.note} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  starup01
                </a>
                <a href={companySNS.wantedly} target="_blank" rel="noopener noreferrer" className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors">
                  <svg className="w-3 h-3 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M15.833 3.477c-.832.367-1.51.617-2.033.75a3.743 3.743 0 00-1.216-.183c-.788 0-1.436.28-1.942.84-.398.438-.597 1.008-.597 1.712v1.383H6.2c-.061.333-.09.664-.09.99-.006 3.917 1.003 6.51 3.028 7.777 1.026.64 2.238.96 3.634.96.102 0 .196-.005.282-.013l.22.002h.098c.873.003 1.738-.16 2.59-.485l.028-.01v2.818l-.033.063c-.462.775-1.088 1.348-1.873 1.715-.788.367-1.678.55-2.673.55-1.198 0-2.296-.254-3.3-.764C4.764 21.6 3.75 20.71 2.825 19.435c-.927-1.277-1.39-2.69-1.39-4.225 0-1.21.265-2.304.79-3.28.523-.977 1.238-1.792 2.143-2.447.906-.653 1.958-1.097 3.16-1.33.28-.055.567-.098.858-.13.232-.023.456-.04.674-.048l.05-.002c1.432-1.134 3.105-1.702 5.015-1.702h.534l-.033.08c-.204.64-.37 1.195-.5 1.67l-.03.126h-.067c-.445 0-.855.047-1.23.139zm-1.78 10.828c-.995 0-1.81-.296-2.442-.886-.632-.59-.95-1.333-.95-2.228 0-.9.318-1.65.95-2.246.632-.597 1.447-.897 2.442-.897.998 0 1.817.3 2.453.9.636.6.955 1.352.955 2.243 0 .896-.319 1.634-.955 2.214-.636.577-1.455.867-2.453.867zm-1.792-8.577c-.454 0-.844.085-1.17.254-.327.17-.59.408-.79.713-.199.305-.3.664-.3 1.078 0 .413.101.772.3 1.077.2.305.463.544.79.713.326.17.716.254 1.17.254.457 0 .85-.085 1.18-.254.33-.17.596-.408.798-.713.2-.305.3-.664.3-1.077 0-.414-.1-.773-.3-1.078-.202-.305-.468-.544-.798-.713-.33-.17-.723-.254-1.18-.254z"/>
                  </svg>
                  Wantedly
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Explore */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Explore</h3>
            <div className="space-y-2">
              <TransitionLink href="/about" className="block text-gray-600 hover:text-gray-900 transition-colors">
                About
              </TransitionLink>
              <TransitionLink href="/member" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Member
              </TransitionLink>
              <TransitionLink href="/news" className="block text-gray-600 hover:text-gray-900 transition-colors">
                News
              </TransitionLink>
              <TransitionLink href="/recruit" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Career
              </TransitionLink>
              <TransitionLink href="/contact" className="block text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </TransitionLink>
            </div>
          </div>

          {/* Follow us */}
          <div>
            <h3 className="text-lg font-medium text-gray-500 mb-4">Follow us</h3>
            <div className="space-y-2">
              <a href={companySNS.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                @starup01
              </a>
              <a href={companySNS.note} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                starup01
              </a>
              <a href={companySNS.wantedly} target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.833 3.477c-.832.367-1.51.617-2.033.75a3.743 3.743 0 00-1.216-.183c-.788 0-1.436.28-1.942.84-.398.438-.597 1.008-.597 1.712v1.383H6.2c-.061.333-.09.664-.09.99-.006 3.917 1.003 6.51 3.028 7.777 1.026.64 2.238.96 3.634.96.102 0 .196-.005.282-.013l.22.002h.098c.873.003 1.738-.16 2.59-.485l.028-.01v2.818l-.033.063c-.462.775-1.088 1.348-1.873 1.715-.788.367-1.678.55-2.673.55-1.198 0-2.296-.254-3.3-.764C4.764 21.6 3.75 20.71 2.825 19.435c-.927-1.277-1.39-2.69-1.39-4.225 0-1.21.265-2.304.79-3.28.523-.977 1.238-1.792 2.143-2.447.906-.653 1.958-1.097 3.16-1.33.28-.055.567-.098.858-.13.232-.023.456-.04.674-.048l.05-.002c1.432-1.134 3.105-1.702 5.015-1.702h.534l-.033.08c-.204.64-.37 1.195-.5 1.67l-.03.126h-.067c-.445 0-.855.047-1.23.139zm-1.78 10.828c-.995 0-1.81-.296-2.442-.886-.632-.59-.95-1.333-.95-2.228 0-.9.318-1.65.95-2.246.632-.597 1.447-.897 2.442-.897.998 0 1.817.3 2.453.9.636.6.955 1.352.955 2.243 0 .896-.319 1.634-.955 2.214-.636.577-1.455.867-2.453.867zm-1.792-8.577c-.454 0-.844.085-1.17.254-.327.17-.59.408-.79.713-.199.305-.3.664-.3 1.078 0 .413.101.772.3 1.077.2.305.463.544.79.713.326.17.716.254 1.17.254.457 0 .85-.085 1.18-.254.33-.17.596-.408.798-.713.2-.305.3-.664.3-1.077 0-.414-.1-.773-.3-1.078-.202-.305-.468-.544-.798-.713-.33-.17-.723-.254-1.18-.254z"/>
                </svg>
                Wantedly
              </a>
            </div>
          </div>

          {/* Empty column */}
          <div></div>

          {/* Contact & Career */}
          <div className="space-y-4">
            <TransitionLink 
              href="/contact" 
              className="group flex items-center justify-between bg-orange-500 text-white px-6 py-4 rounded-full hover:bg-orange-600 transition-colors"
            >
              <span className="font-medium">Contact</span>
              <div className="bg-white text-orange-500 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">お気軽にご相談ください</p>

            <TransitionLink 
              href="/recruit" 
              className="group flex items-center justify-between bg-gray-800 text-white px-6 py-4 rounded-full hover:bg-gray-900 transition-colors mt-6"
            >
              <span className="font-medium">Career</span>
              <div className="bg-white text-gray-800 rounded-full p-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </TransitionLink>
            <p className="text-sm text-gray-500">一緒に働きませんか</p>
          </div>
        </div>

      </div>
      
      {/* Large text logo */}
      <div className="w-full max-w-[1500px] mx-auto">
        <div ref={logoRef} className="flex items-center justify-center gap-2 md:gap-4 w-full h-full">
          <svg ref={svgRef} id="_レイヤー_1" data-name="レイヤー 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 289.07 41.84">
            <defs>
              <linearGradient id="logoGradient" x1="0" y1="0" x2="289.07" y2="0" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="100%" stopColor="#000000" />
              </linearGradient>
            </defs>
            <path fill="url(#logoGradient)" d="M60.39,2.44c-1.88.15-3.88.43-5.96.82,5.05.99,4.95,4.81-.58,9.91C50.76,5.46,43.23,0,34.41,0,22.86,0,13.49,9.37,13.49,20.92c0,2.73.53,5.34,1.48,7.73-.05-.49-.08-.99-.08-1.5,0-8.15,6.61-14.75,14.75-14.75,5.83,0,10.86,3.39,13.25,8.31-8.86,4.84-19.59,8.57-27.38,9.19-6.61.53-9.55-1.29-8.64-4.51-10.92,9.57-8.72,16.21,5.6,15.05,8.93-.72,20.59-4.31,31.37-9.29-1.54,5.46-6.14,9.62-11.83,10.54.78.09,1.58.14,2.39.14,10.02,0,18.39-7.04,20.44-16.45,3.32-1.97,6.38-4.05,9.05-6.16,13.23-10.5,11.66-18.02-3.51-16.79Z"/>
            <g fill="url(#logoGradient)">
              <polygon points="151.17 1.41 125.2 1.41 125.2 8.25 135.14 8.25 135.14 40.56 141.24 40.56 141.24 8.25 151.17 8.25 151.17 1.41"/>
              <path d="M169.14,1.13h-5.49l-13.98,39.43h6.23l3.22-9.32h14.42l3.18,9.32h6.4L169.2,1.32l-.06-.18ZM171.33,24.68h-10l4.98-14.33,5.02,14.33Z"/>
              <path d="M215.26,13.98v-.11c0-3.36-.92-6.3-2.66-8.5-2.15-2.59-5.35-3.96-9.25-3.96h-14.24v39.15h6.06v-13.46h6.45l7.62,13.32.08.14h7.17l-8.53-14.74c4.71-1.81,7.3-6,7.3-11.83ZM209.12,14.26v.11c0,3.75-2.42,6.18-6.17,6.18h-7.78v-12.41h7.73c4.01,0,6.21,2.17,6.21,6.12Z"/>
              <path d="M251.21,23.9c0,6.72-2.7,10.42-7.6,10.42s-7.64-3.9-7.64-10.7V1.41h-6.06v22.5c0,10.97,4.96,17.26,13.61,17.26s13.74-6.41,13.74-17.59V1.41h-6.05v22.5Z"/>
              <path d="M276.89,1.41h-12.48v39.15h5.91v-12.41h5.94c7.78,0,12.8-5.28,12.8-13.46v-.11c0-8.01-4.78-13.18-12.18-13.18ZM270.32,8.14h6.12c4.12,0,6.48,2.41,6.48,6.62v.11c0,3.96-2.6,6.62-6.48,6.62h-6.12v-13.34Z"/>
              <path d="M107.6,6.71c1.68,0,3.1.45,4.22,1.35,1.13.9,1.94,2.06,2.4,3.45l.09.27,5.87-2.14-.08-.25c-.52-1.66-1.32-3.15-2.39-4.43-1.07-1.33-2.46-2.38-4.11-3.11-1.62-.77-3.55-1.17-5.71-1.17-3.85,0-6.86,1.03-8.94,3.06-2.09,2-3.14,4.84-3.14,8.45,0,1.92.36,3.6,1.08,5.01.75,1.41,1.77,2.59,3.05,3.51,1.29.92,2.75,1.62,4.34,2.1l4.11,1.19c1.67.49,3.02,1.2,4,2.11.97.86,1.44,1.94,1.44,3.32,0,1.52-.56,2.71-1.71,3.64-1.15.93-2.75,1.4-4.74,1.4-1.71-.04-3.17-.54-4.32-1.51-1.16-.97-1.95-2.12-2.35-3.4l-.09-.27-5.96,2.08.06.24c.29,1.14.8,2.27,1.52,3.35.74,1.03,1.68,1.98,2.78,2.83,1.14.85,2.45,1.52,3.9,2,1.49.48,3.14.72,4.91.72,2.61,0,4.86-.49,6.67-1.44,1.86-.96,3.28-2.31,4.22-4.02.94-1.7,1.42-3.68,1.42-5.89,0-2.51-.86-4.84-2.55-6.9-1.69-2.06-4.08-3.53-7.12-4.38l-4.11-1.14c-1.35-.39-2.44-.95-3.22-1.67-.74-.74-1.11-1.79-1.11-3.11,0-1.65.49-2.95,1.44-3.87.99-.92,2.38-1.39,4.11-1.39Z"/>
            </g>
          </svg>
        </div>
      </div>
      <div className="w-full max-w-[1500px] mx-auto pt-16">
        <p ref={textRef} className="text-center text-gray-500 text-lg">Ready to make Impact?</p>
      </div>
    </footer>
  )
}