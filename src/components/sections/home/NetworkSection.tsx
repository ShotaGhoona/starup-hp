'use client'

import NetworkBackground from '@/components/animation/network-background/NetworkBackground'
import Background from '@/components/layout/Background'
import NetworkModel from '@/components/animation/network-model/network-model'

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

      {/* Network Model SVG */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-6 w-full h-full flex items-center justify-center">
          {/* <NetworkModel /> */}
        </div>
      </div>
    </section>
  )
}