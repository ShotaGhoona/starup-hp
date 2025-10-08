'use client'

import { SphereScan } from '@/components/animation/sphere-scan'

export default function TestSphereScanPage() {
  return (
    <div className="w-screen h-screen bg-white flex items-center justify-center">
      <div className="w-96 h-96">
        <SphereScan />
      </div>
    </div>
  )
}