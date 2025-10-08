'use client'

import NetworkBackground from '@/components/animation/network-background/NetworkBackground'

interface NetworkSectionProps {
  className?: string
}

export default function NetworkSection({ className = '' }: NetworkSectionProps) {
  return (
    <section className={`relative py-20 min-h-screen bg-black overflow-hidden ${className}`}>
      {/* ネットワーク背景 */}
      <div className="absolute inset-0 z-0">
        <NetworkBackground className="w-full h-full" />
      </div>
    </section>
  )
}