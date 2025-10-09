'use client'

import { Facebook, Linkedin } from 'lucide-react'

interface MemberCardProps {
  name: string
  englishName?: string
  position: string
  description: string
  image?: string
  socialLinks?: {
    twitter?: string
    facebook?: string
    linkedin?: string
  }
  className?: string
}

export default function MemberCard({ 
  name, 
  englishName, 
  position, 
  description, 
  image, 
  socialLinks,
  className = '' 
}: MemberCardProps) {
  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-lg ${className}`}>
      {/* 画像エリア */}
      <div className="relative aspect-square bg-gray-100">
        {/* 青いグラデーション装飾 */}
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-[#878DFF] to-[#0928FB] rounded-tr-lg translate-x-2 translate-y-2 z-10"></div>
        
        {/* 写真 */}
        <div className="relative w-full h-full -translate-x-1 -translate-y-1">
          {image ? (
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="currentColor"/>
                <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="currentColor"/>
              </svg>
            </div>
          )}
        </div>
      </div>
      
      {/* テキスト情報 */}
      <div className="p-6">
        {/* 役職 */}
        <p className="text-sm text-gray-500 mb-2">{position}</p>
        
        {/* 名前 */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
        
        {/* 英語名 */}
        {englishName && (
          <p className="text-base text-gray-600 mb-4">{englishName}</p>
        )}
        
        {/* 説明文 */}
        <p className="text-sm text-gray-700 leading-relaxed mb-6">
          {description}
        </p>
        
        {/* ソーシャルアイコン */}
        {socialLinks && (
          <div className="flex gap-3">
            {socialLinks.twitter && (
              <a 
                href={socialLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            )}
            {socialLinks.facebook && (
              <a 
                href={socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#1877F2] rounded-full flex items-center justify-center text-white hover:bg-[#166FE5] transition-colors"
              >
                <Facebook size={16} />
              </a>
            )}
            {socialLinks.linkedin && (
              <a 
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-[#0A66C2] rounded-full flex items-center justify-center text-white hover:bg-[#004182] transition-colors"
              >
                <Linkedin size={16} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}