'use client'

import { serviceData } from '@/data/service/service'
import ExpandingCards from '@/components/ui/ExpandingCards'
import ViewMoreLink from '@/components/ui/ViewMoreLink'
interface ServiceSectionProps {
  className?: string
}

export default function ServiceSection({ className = '' }: ServiceSectionProps) {
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
              <ViewMoreLink href="/product" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}