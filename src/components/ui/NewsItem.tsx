'use client'

import { NewsListItem } from '@/lib/news'
import Link from 'next/link'

interface NewsItemProps {
  item: NewsListItem
  showDivider?: boolean
}

export default function NewsItem({ item, showDivider = false }: NewsItemProps) {
  return (
    <div>
      <div className="grid grid-cols-8 gap-6 items-start py-8">
        <div className="col-span-2 text-sm text-gray-500 font-light min-w-[80px]">
          {item.date.replace(/\//g, '.')}
        </div>
        
        <div className="col-span-2">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300"
          />
        </div>
        
        <div className="col-span-4 flex flex-col justify-between h-full">
          <h3 className="text-lg font-medium text-gray-800 mb-3 leading-tight">
            {item.title}
          </h3>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">
              #{item.category}
            </span>
            <Link 
              href={`/news/${item.id}`}
              className="text-xs text-gray-800 hover:text-black transition-all duration-300 font-medium flex items-center gap-1 group"
            >
              READ MORE
              <svg className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
      
      {showDivider && (
        <div className="w-full h-px bg-gray-200"></div>
      )}
    </div>
  )
}