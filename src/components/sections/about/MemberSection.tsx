'use client'

import Background from '@/components/layout/Background'
import { MemberCard } from '@/components/ui'
import { memberData } from '@/data/member/member'

export default function MemberSection() {
  return (
    <section className="relative py-20 px-8">
      <Background />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-black mb-2">
            MEMBER
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-[#7A83FA] to-[#002AF4] mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-4 gap-6">
          {memberData.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
            />
          ))}
        </div>
      </div>
    </section>
  )
}