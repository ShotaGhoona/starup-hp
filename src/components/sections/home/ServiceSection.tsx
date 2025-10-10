'use client'

import { serviceData } from '@/data/service/service'
import ExpandingCards from '@/components/ui/ExpandingCards'
import { useRouter } from 'next/navigation'
interface ServiceSectionProps {
  className?: string
}

export default function ServiceSection({ className = '' }: ServiceSectionProps) {
  const router = useRouter()

  return (
    <section className={`relative py-20 ${className}`}>
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-4">
            OUR SERVICES
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-[#7A83FA] to-[#002AF4] rounded-full mx-auto"></div>
        </div>

        {/* Service Categories */}
        <div className="space-y-16">
          {serviceData.map((category) => (
            <div key={category.id} className="space-y-8">
              {/* Category Title */}
              <div className="text-left">
                <h3 className="text-3xl font-bold text-gray-900 mb-6">
                  {category.title}
                </h3>
              </div>

              {/* Expanding Cards */}
              <div className="w-full">
                <ExpandingCards 
                  options={category.cards}
                  className="bg-transparent"
                />
              </div>

              {/* View More Link */}
              <div className="text-right mt-8">
                <button
                  onClick={() => router.push('/product')}
                  className="group inline-flex items-center gap-3 text-gray-700 hover:text-[#002AF4] transition-colors duration-200 font-semibold text-lg"
                >
                  <span className="relative">
                    View More
                    <span className="absolute left-0 bottom-0 w-0 h-[2px] bg-[#002AF4] transition-all duration-300 group-hover:w-full"></span>
                  </span>
                  <svg 
                    className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" 
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
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}