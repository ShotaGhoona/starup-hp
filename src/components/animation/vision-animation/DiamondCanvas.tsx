'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface DiamondCanvasProps {
  color: string
  intensity?: number
  className?: string
}

export default function DiamondCanvas({ 
  color, 
  intensity = 1,
  className = '' 
}: DiamondCanvasProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const diamondRef = useRef<THREE.Mesh | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    if (!mountRef.current) return

    // シーン作成
    const scene = new THREE.Scene()
    sceneRef.current = scene

    // カメラ作成
    const camera = new THREE.PerspectiveCamera(
      50,
      1, // 正方形
      0.1,
      1000
    )
    camera.position.set(3, 2, 4) // 右上からの視点
    camera.lookAt(0, 0, 0) // 中心を見る

    // レンダラー作成
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    })
    renderer.setSize(400, 400)
    renderer.setClearColor(0x000000, 0)
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // 薄い立方体形状作成（より大きく）
    const geometry = new THREE.BoxGeometry(4, 0.4, 4)
    
    // マテリアル作成（グラデーション効果）
    const material = new THREE.MeshPhongMaterial({
      color: color,
      transparent: true,
      opacity: 0.8 * intensity,
      shininess: 100,
      specular: 0x444444
    })

    // ダイヤモンドメッシュ
    const diamond = new THREE.Mesh(geometry, material)
    diamondRef.current = diamond
    scene.add(diamond)

    // ライト設定
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(2, 2, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(color, intensity, 10)
    pointLight.position.set(0, 0, 3)
    scene.add(pointLight)

    // マウスイベント
    const handleMouseMove = (event: MouseEvent) => {
      if (!mountRef.current) return
      
      const rect = mountRef.current.getBoundingClientRect()
      mouseRef.current.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouseRef.current.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleMouseEnter = () => {
      if (mountRef.current) {
        mountRef.current.style.cursor = 'pointer'
      }
    }

    const handleMouseLeave = () => {
      mouseRef.current = { x: 0, y: 0 }
      if (mountRef.current) {
        mountRef.current.style.cursor = 'default'
      }
    }

    // イベントリスナー
    mountRef.current.addEventListener('mousemove', handleMouseMove)
    mountRef.current.addEventListener('mouseenter', handleMouseEnter)
    mountRef.current.addEventListener('mouseleave', handleMouseLeave)

    // アニメーション
    const animate = () => {
      if (diamondRef.current) {
        const time = Date.now() * 0.001
        
        // 基本回転
        diamondRef.current.rotation.y += 0.005
        diamondRef.current.rotation.x += 0.003
        
        // マウスインタラクション
        const targetRotationX = mouseRef.current.y * 0.5
        const targetRotationY = mouseRef.current.x * 0.5
        
        diamondRef.current.rotation.x += (targetRotationX - diamondRef.current.rotation.x) * 0.1
        diamondRef.current.rotation.y += (targetRotationY - diamondRef.current.rotation.y) * 0.1
        
        // 浮遊効果を無効化
        // diamondRef.current.position.y = Math.sin(time * 2) * 0.1
        
        // スケールアニメーション（マウスホバー時）
        const distance = Math.sqrt(mouseRef.current.x ** 2 + mouseRef.current.y ** 2)
        const targetScale = distance > 0 ? 1.2 : 1.0
        const currentScale = diamondRef.current.scale.x
        const newScale = currentScale + (targetScale - currentScale) * 0.1
        diamondRef.current.scale.setScalar(newScale)
      }

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate()

    // クリーンアップ
    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeEventListener('mousemove', handleMouseMove)
        mountRef.current.removeEventListener('mouseenter', handleMouseEnter)
        mountRef.current.removeEventListener('mouseleave', handleMouseLeave)
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [color, intensity])

  return (
    <div 
      ref={mountRef} 
      className={`w-[200px] h-[200px] ${className}`}
    />
  )
}