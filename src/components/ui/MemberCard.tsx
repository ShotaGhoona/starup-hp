'use client'

import { Facebook, Linkedin } from 'lucide-react'
import { Member } from '@/data/member/member'

interface MemberCardProps {
  member: Member
  className?: string
}

export default function MemberCard({ 
  member,
  className = '' 
}: MemberCardProps) {
  const { name, englishName, position, description, image, socialLinks } = member
  return (
    <div className={` ${className}`}>
      {/* 画像エリア */}
      <div className="aspect-square relative">
        {/* 青いグラデーション装飾 */}
          <div className="w-[95%] h-[95%] bg-gradient-to-br from-[#878DFF] to-[#0928FB] rounded-tl-3xl rounded-br-3xl absolute bottom-0 left-0"></div>
          <div className="w-[95%] h-[95%] z-10 absolute top-0 right-0">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover rounded-tl-3xl rounded-br-3xl"
            />
          </div>
      </div>
      
      {/* テキスト情報 */}
      <div className="py-6">
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