'use client'

import { useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'

interface Star {
  x: number
  y: number
  z: number
  opacity: number
  hasWarpEffect: boolean
}

interface StarWarpSpeedProps {
  className?: string
}

export function StarWarpSpeed({ className = '' }: StarWarpSpeedProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number>(0)
  const starsRef = useRef<Star[]>([])
  const warpRef = useRef<number>(0)
  const warpTransitionRef = useRef<number>(0)
  const animateRef = useRef<boolean>(true)

  // 設定値（星の数を3倍に増加）
  const CONFIG = {
    numStars: 5700, // 1900 * 3
    warpEffectRatio: 1/3, // ワープエフェクトを適用する星の割合
    baseRadius: parseFloat('0.' + Math.floor(Math.random() * 9) + 1),
    focalLengthMultiplier: 2,
    starColor: 'rgba(209, 255, 255, ',
    backgroundColor: 'rgba(15, 10, 35, 1)' // 紫寄りの宇宙背景
  }

  const initializeStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const stars: Star[] = []
    for (let i = 0; i < CONFIG.numStars; i++) {
      const star: Star = {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        opacity: parseFloat('0.' + Math.floor(Math.random() * 99) + 1),
        hasWarpEffect: Math.random() < CONFIG.warpEffectRatio // 1/3の確率でワープエフェクト対象
      }
      stars.push(star)
    }
    starsRef.current = stars
  }, [CONFIG.numStars, CONFIG.warpEffectRatio])

  const moveStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // ワープトランジション処理
    if (warpRef.current === 1 && warpTransitionRef.current < 1) {
      warpTransitionRef.current += 0.05 // 20フレームで完全にワープ状態へ
    } else if (warpRef.current === 0 && warpTransitionRef.current > 0) {
      warpTransitionRef.current -= 0.03 // 通常状態への復帰はゆっくり
    }

    // 範囲を0-1に制限
    warpTransitionRef.current = Math.max(0, Math.min(1, warpTransitionRef.current))

    for (let i = 0; i < CONFIG.numStars; i++) {
      const star = starsRef.current[i]
      
      // ワープエフェクト対象の星のみ速度変更
      let speedMultiplier = 1
      if (star.hasWarpEffect) {
        speedMultiplier = 1 + warpTransitionRef.current * 4 // 最大5倍速
      }
      
      star.z -= speedMultiplier

      if (star.z <= 0) {
        star.z = canvas.width
      }
    }
  }, [CONFIG.numStars])

  const drawStars = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // リサイズ処理
    if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeStars()
    }

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const focalLength = canvas.width * CONFIG.focalLengthMultiplier

    // 背景クリア（ワープの強度に応じて調整）
    if (warpTransitionRef.current < 1) {
      const backgroundOpacity = 1 - warpTransitionRef.current * 0.8 // ワープ時は背景を薄く
      ctx.fillStyle = `rgba(15, 10, 35, ${backgroundOpacity})` // 紫寄りの背景
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // 星の描画
    ctx.fillStyle = CONFIG.starColor + CONFIG.baseRadius + ')'
    
    for (let i = 0; i < CONFIG.numStars; i++) {
      const star = starsRef.current[i]

      // 3D座標を2D座標に変換（遠近法）
      const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX
      const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY
      const pixelRadius = 1 * (focalLength / star.z)

      // ワープエフェクト：ワープエフェクト対象の星のみ軌跡描画
      if (warpTransitionRef.current > 0 && star.hasWarpEffect) {
        const trailLength = 20 * warpTransitionRef.current
        const prevZ = star.z + trailLength
        const prevPixelX = (star.x - centerX) * (focalLength / prevZ) + centerX
        const prevPixelY = (star.y - centerY) * (focalLength / prevZ) + centerY
        
        // グラデーション軌跡
        const gradient = ctx.createLinearGradient(prevPixelX, prevPixelY, pixelX, pixelY)
        gradient.addColorStop(0, `rgba(209, 255, 255, 0)`)
        gradient.addColorStop(1, `rgba(209, 255, 255, ${star.opacity * warpTransitionRef.current})`)
        
        ctx.strokeStyle = gradient
        ctx.lineWidth = pixelRadius * 0.5
        ctx.beginPath()
        ctx.moveTo(prevPixelX, prevPixelY)
        ctx.lineTo(pixelX, pixelY)
        ctx.stroke()
      }

      // 星を小さな正方形として描画（元コードに忠実）
      ctx.fillRect(pixelX, pixelY, pixelRadius, pixelRadius)
      
      // 各星の個別の透明度を適用（ワープエフェクト対象の星のみ明度を上げる）
      let brightness = star.opacity
      if (star.hasWarpEffect) {
        brightness += warpTransitionRef.current * 0.3
      }
      ctx.fillStyle = CONFIG.starColor + Math.min(1, brightness) + ')'
    }
  }, [CONFIG, initializeStars])

  const executeFrame = useCallback(() => {
    if (animateRef.current) {
      animationIdRef.current = requestAnimationFrame(executeFrame)
    }
    moveStars()
    drawStars()
  }, [moveStars, drawStars])

  const enableWarp = useCallback(() => {
    warpRef.current = 1
  }, [])

  const disableWarp = useCallback(() => {
    warpRef.current = 0
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // キャンバスサイズを設定
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    // 星を初期化
    initializeStars()

    // アニメーション開始
    animateRef.current = true
    executeFrame()

    // リサイズハンドラ
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        initializeStars()
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      animateRef.current = false
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('resize', handleResize)
    }
  }, [initializeStars, executeFrame])

  return (
    <div className={`relative w-full h-[300px] overflow-hidden ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          background: 'linear-gradient(135deg, rgba(25, 15, 60, 1) 0%, rgba(15, 10, 35, 1) 50%, rgba(35, 20, 70, 1) 100%)',
          imageRendering: 'pixelated'
        }}
      />
      <div className="max-w-7xl mx-auto h-full relative z-10 flex items-center justify-between gap-6">
        
        {/* タイトル */}
        <div className="max-w-xl">
          <h1 className="text-white text-4xl font-bold">Contact</h1>
          <p className="text-white text-base">
            お気軽にお問い合わせください。
          </p>
        </div>
        
        {/* お問い合わせボタン */}
        <Link href="/contact"> 
        <div
          onMouseEnter={enableWarp}
          onMouseLeave={disableWarp}
          className="text-cyan-100 border-2 border-cyan-100 py-4 px-8 text-center
                     font-bold text-xl bg-black bg-opacity-80 transition-all duration-200 cursor-pointer
                     hover:shadow-[0_0_10px_#eef,0_0_12px_#a0cdff_inset]
                     hover:[text-shadow:0_0_12px_#489cfa,0_0_5px_#fff]
                     hover:text-white"
        >
          お問い合わせはこちら
        </div>
        </Link>
      </div>
    </div>
  )
}