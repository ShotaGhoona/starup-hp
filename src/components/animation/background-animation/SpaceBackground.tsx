'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SpaceBackgroundProps {
  className?: string
}

export default function SpaceBackground({ className = '' }: SpaceBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    // シーン作成
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.offsetWidth / mountRef.current.offsetHeight,
      0.1,
      1000
    )
    camera.position.z = 1

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight)
    renderer.setClearColor(0x000814, 1) // 深い宇宙の色
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // 星の作成
    const starsGeometry = new THREE.BufferGeometry()
    const starCount = 3000
    const positions = new Float32Array(starCount * 3)

    for (let i = 0; i < starCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 20     // x
      positions[i + 1] = (Math.random() - 0.5) * 20 // y  
      positions[i + 2] = (Math.random() - 0.5) * 20 // z
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const starsMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      sizeAttenuation: true
    })

    const stars = new THREE.Points(starsGeometry, starsMaterial)
    scene.add(stars)

    // アニメーション
    const animate = () => {
      stars.rotation.x += 0.0005
      stars.rotation.y += 0.0005

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    // リサイズ処理
    const handleResize = () => {
      if (!mountRef.current) return
      
      const width = mountRef.current.offsetWidth
      const height = mountRef.current.offsetHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    animate()

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      className="absolute -z-10 overflow-visible"
      style={{
        top: '-10vh',
        left: '80%',
        transform: 'translateX(-50%)',
        width: '140vw',
        height: 'calc(140vw / 1.74)', // アスペクト比計算
      }}
    >
        <div 
          ref={mountRef} 
          className={`absolute inset-0 w-full h-full ${className}`}
          style={{ 
            background: 'radial-gradient(ellipse at center, #0c1445 0%, #000814 50%, #000000 100%)',
            clipPath: 'url(#starup-logo-clip)'
          }}
        >
          {/* SVGクリップパス定義 */}
          <svg width="0" height="0" style={{ position: 'absolute' }}>
            <defs>
              <clipPath id="starup-logo-clip" clipPathUnits="objectBoundingBox">
                <path d="M145.19,5.86c-4.52.36-9.32,1.03-14.34,1.98,12.14,2.38,11.91,11.58-1.39,23.84C122.05,13.12,103.93,0,82.74,0c-27.78,0-50.3,22.52-50.3,50.3,0,6.57,1.27,12.84,3.57,18.6-.12-1.19-.18-2.39-.18-3.6,0-19.59,15.88-35.47,35.47-35.47,14.02,0,26.11,8.16,31.87,19.97-21.3,11.63-47.09,20.6-65.83,22.1-15.89,1.28-22.97-3.1-20.77-10.84-26.25,23.02-20.96,38.96,13.45,36.19,21.48-1.73,49.51-10.37,75.43-22.34-3.7,13.12-14.76,23.13-28.44,25.35,1.88.21,3.8.34,5.74.34,24.09,0,44.21-16.94,49.14-39.55,7.97-4.75,15.34-9.73,21.75-14.81,31.8-25.24,28.03-43.31-8.44-40.38Z" 
                      transform="scale(0.00571 0.00994)" />
              </clipPath>
            </defs>
          </svg>
        </div>
    </div>
  )
}