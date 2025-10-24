'use client'

import Image from 'next/image'
import { useState, useEffect } from 'react'

interface RecruitSectionProps {
  className?: string
}

export default function RecruitSection({ className = '' }: RecruitSectionProps) {
  const images = [
    '/images/recruit/office-1.jpg',
    '/images/recruit/office-2.jpg'
  ]
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, 5000)
    
    return () => clearInterval(interval)
  }, [images.length])

  return (
    <section className={`relative min-h-screen flex items-center justify-center bg-white ${className}`}>
      <div className="absolute inset-0 h-[70vh] w-7xl top-1/2 -translate-y-1/2">
        <img src="/images/recruit/main.jpg" alt="recruit-section-bg" className="w-full h-full object-cover rounded-r-[50px]" />
        <div className="absolute inset-0 rounded-r-[50px]" style={{ background: '#0077B7D6' }}></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-white">
            <h2 className="text-5xl font-bold mb-8">CAREERS</h2>
            <div className="space-y-4 text-lg leading-relaxed mb-8">
              <p>
                わたしたちは、新しいものづくりで理想の暮らしを叶えるように、
                <br />
                私たちの理想の働き方を創造し、体験し
              </p>
              <p>
                私たちは組織をさらに成長させています。
              </p>
              <p>
                わたしたちと一緒に、手に新しい価値を
                <br />
                つくっていきませんか？
              </p>
            </div>
            
            <button className="bg-white text-blue-600 px-8 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors duration-200">
              求人を見る
            </button>
          </div>

          {/* Right image slideshow */}
          <div className="relative">
            <div className="w-80 h-64 mx-auto">
              <Image
                src={images[currentImageIndex]}
                alt={`オフィス風景 ${currentImageIndex + 1}`}
                fill
                className="object-cover rounded-lg shadow-lg transition-opacity duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}