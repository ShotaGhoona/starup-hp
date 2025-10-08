'use client'

import { newsData } from '@/data/news/news'
import Background from '@/components/layout/Background'

export default function NewsSection() {
  return (
    <section className="relative py-20 px-8">
      <Background />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-8 gap-12 mb-12">
          <div className="col-span-2">
            <h2 className="text-4xl font-bold text-black mb-2">
              NEWS
            </h2>
            <div className="w-16 h-1  bg-gradient-to-r from-[#7A83FA] to-[#002AF4]"></div>
          </div>
          
          <div className="col-span-6">
            <div className="space-y-0 border-y border-gray-700">
              {newsData.map((news, index) => (
                <div key={news.id} className={`py-6 ${index !== newsData.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex flex-col gap-3">
                    <div>
                      <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                        {news.category}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-normal text-gray-900 leading-relaxed">
                        {news.title}
                      </h3>
                    </div>
                    <div>
                      <time className="text-sm text-gray-500">{news.date}</time>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-right">
              <button className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors">
                Read More News
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}