'use client'

import { NewsListItem } from '@/types/news'
import TransitionLink from '@/components/ui/TransitionLink'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

interface NewsItemProps {
  item: NewsListItem
  showDivider?: boolean
}

export default function NewsItem({ item, showDivider = false }: NewsItemProps) {
  const itemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!itemRef.current) return

    // 初期状態を設定
    gsap.set(itemRef.current, { opacity: 0, y: 30 })

    // スクロールアニメーション
    gsap.to(itemRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: itemRef.current,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse'
      }
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={itemRef}>
      {/* Mobile Layout */}
      <TransitionLink href={`/news/${item.id}`} className="block md:hidden py-6 group cursor-pointer">
        <div className="flex flex-col space-y-4">
          {/* Date */}
          <div className="text-sm text-gray-500 font-light">
            {item.date.replace(/\//g, '.')}
          </div>

          {/* Title */}
          <h3 className="text-lg font-medium text-gray-800 leading-tight group-hover:text-black transition-colors">
            {item.title}
          </h3>

          {/* Image */}
          <div className="w-full aspect-[16/9] overflow-hidden relative">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="100vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              loading="lazy"
              quality={75}
            />
          </div>

          {/* Tags and Read More */}
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {item.tags.map((tag, index) => (
                <span key={index} className="text-xs text-gray-500 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-gray-800 group-hover:text-black transition-all duration-300 font-medium flex items-center gap-1">
              READ MORE
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </TransitionLink>

      {/* Desktop Layout */}
      <TransitionLink href={`/news/${item.id}`} className="hidden md:block group cursor-pointer">
        <div className="grid grid-cols-8 gap-6 items-start py-8">
          <div className="col-span-2 text-sm text-gray-500 font-light min-w-[80px]">
            {item.date.replace(/\//g, '.')}
          </div>

          <div className="col-span-2 aspect-[4/3] overflow-hidden relative">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
              loading="lazy"
              quality={75}
            />
          </div>

          <div className="col-span-4 flex flex-col justify-between h-full">
            <h3 className="text-lg font-medium text-gray-800 mb-3 leading-tight group-hover:text-black transition-colors">
              {item.title}
            </h3>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-gray-500 font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-800 group-hover:text-black transition-all duration-300 font-medium flex items-center gap-1">
                READ MORE
                <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </TransitionLink>
      
      {showDivider && (
        <div className="w-full h-px bg-gray-200"></div>
      )}
    </div>
  )
}