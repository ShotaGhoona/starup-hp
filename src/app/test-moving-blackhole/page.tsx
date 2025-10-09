'use client'

import { MovingBlackhole } from '@/components/animation/moving-blackhole'

export default function TestMovingBlackholePage() {
  return (
    <div className="w-screen h-screen">
      <MovingBlackhole />
      
      {/* Info panel */}
      <div className="fixed bottom-5 left-5 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm z-10">
        <h3 className="font-bold text-lg mb-2">Moving Blackhole</h3>
        <p className="text-sm opacity-80">Mouse: Orbit camera around blackhole</p>
        <p className="text-sm opacity-80">Scroll: Zoom in/out</p>
        <p className="text-sm opacity-60 mt-2">Stars are affected by curl noise gravitational field</p>
      </div>

      {/* Stats panel */}
      <div className="fixed top-5 right-5 bg-black/70 text-white p-4 rounded-lg backdrop-blur-sm z-10">
        <div className="text-sm">
          <div className="mb-1">✦ Stars: 100,000</div>
          <div className="mb-1">⚫ Blackhole: Radius 20</div>
          <div className="mb-1">🌌 Curl Noise: Active</div>
          <div className="text-xs opacity-60 mt-2">WebGL Shader Animation</div>
        </div>
      </div>
    </div>
  )
}