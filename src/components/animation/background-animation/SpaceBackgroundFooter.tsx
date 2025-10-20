'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SpaceBackgroundFooterProps {
  className?: string
}

export default function SpaceBackgroundFooter({ className = '' }: SpaceBackgroundFooterProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)

  useEffect(() => {
    if (!mountRef.current) return
    
    // クリーンアップ：既存のアニメーションを停止
    if (animationIdRef.current) {
      cancelAnimationFrame(animationIdRef.current)
      animationIdRef.current = null
    }
    
    // 既存のレンダラーをクリーンアップ
    if (rendererRef.current && mountRef.current.contains(rendererRef.current.domElement)) {
      mountRef.current.removeChild(rendererRef.current.domElement)
      rendererRef.current.dispose()
      rendererRef.current = null
    }

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
        animationIdRef.current = null
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div 
      className="absolute inset-0 w-full h-full"
      style={{ zIndex: 0 }}
    >
      <div 
        ref={mountRef} 
        className={`absolute inset-0 w-full h-full ${className}`}
        style={{ 
          background: 'radial-gradient(ellipse at center, #0c1445 0%, #000814 50%, #000000 100%)'
        }}
      />
    </div>
  )
}