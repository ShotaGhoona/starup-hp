'use client'

interface BackgroundProps {
  className?: string
}

export default function Background({ className = '' }: BackgroundProps) {
  return (
    <div 
      className={`absolute inset-0 -z-20 w-full h-full ${className}`}
      style={{
        backgroundColor: '#F8F9FA',
        backgroundImage: `
          linear-gradient(to right, #E5E5E5 1px, transparent 1px),
          linear-gradient(to bottom, #E5E5E5 1px, transparent 1px),
          linear-gradient(to bottom, transparent 0%, transparent 20%, #F8F9FA 40%)
        `,
        backgroundSize: '100px 100px, 100px 100px, 100% 200px'
      }}
    />
  )
}