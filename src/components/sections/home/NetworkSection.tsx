'use client'

import NetworkBackground from '@/components/animation/network-background/NetworkBackground'
import Background from '@/components/layout/Background'

interface NetworkSectionProps {
  className?: string
}

export default function NetworkSection({ className = '' }: NetworkSectionProps) {
  return (
    <section className={`relative py-20 min-h-screen bg-black overflow-hidden ${className}`}>
      {/* ネットワーク背景 */}
      <div className="absolute inset-0 z-0">
        <Background />
        <div className='max-w-7xl mx-auto px-6 h-[800px]'>
          <NetworkBackground className="w-full h-full" />
        </div>
      </div>
    </section>
  )
}