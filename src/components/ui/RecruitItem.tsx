'use client'

import { RecruitListItem } from '@/lib/recruit'
import TransitionLink from '@/components/ui/TransitionLink'

interface RecruitItemProps {
  item: RecruitListItem
  showDivider?: boolean
}

export default function RecruitItem({ item, showDivider = false }: RecruitItemProps) {
  return (
    <div>
      {/* Mobile Layout */}
      <TransitionLink href={`/recruit/${item.id}`} className="block md:hidden py-6 group cursor-pointer">
        <div className="flex flex-col space-y-4">
          {/* Title */}
          <h3 className="text-lg font-medium text-gray-800 leading-tight group-hover:text-black transition-colors">
            {item.title}
          </h3>

          {/* Summary */}
          {item.summary && (
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.summary}
            </p>
          )}

          {/* Image */}
          <div className="w-full">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-48 object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Tags and Read More */}
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-gray-500 font-medium">
                #{item.jobType}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                #{item.location}
              </span>
              <span className="text-xs text-gray-500 font-medium">
                #{item.employmentType}
              </span>
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
      <TransitionLink href={`/recruit/${item.id}`} className="hidden md:block group cursor-pointer">
        <div className="grid grid-cols-6 gap-6 items-start py-8">
          <div className="col-span-2">
            <img
              src={item.imageUrl}
              alt={item.title}
              className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
            />
          </div>

          <div className="col-span-4 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-3 leading-tight group-hover:text-black transition-colors">
                {item.title}
              </h3>
              {item.summary && (
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  {item.summary}
                </p>
              )}
            </div>
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  #{item.jobType}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  #{item.location}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  #{item.employmentType}
                </span>
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
