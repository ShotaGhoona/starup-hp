'use client'

import { StarWarpSpeed } from '@/components/animation/star-warp-speed/StarWarpSpeed'

export default function TestStarWarpSpeedPage() {
  return (
    <div className="min-h-screen">
      <div className="relative">
        <StarWarpSpeed />
        
        {/* ページ情報オーバーレイ */}
        <div className="absolute top-5 left-5 z-20 bg-black bg-opacity-70 text-white p-4 rounded">
          <h1 className="text-xl font-bold mb-2">Star Warp Speed Test</h1>
          <p className="text-sm mb-2">元のstar-wrap-speed.mdを忠実に再現</p>
          <ul className="text-xs space-y-1">
            <li>• 1900個の星が3D空間に配置</li>
            <li>• 遠近法でZ軸方向に移動</li>
            <li>• WARP SPEEDボタンでエフェクト切り替え</li>
            <li>• Canvas 2Dで描画</li>
            <li>• レスポンシブ対応</li>
          </ul>
        </div>
      </div>
    </div>
  )
}