'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

// 直感的に調整できる設定
const CONFIG = {
  // レンダリング設定
  canvas: {
    width: 600,
    height: 900,
  },
  
  // カメラ設定
  camera: {
    fov: 75,
    position: { x: 0, y: 0, z: 8 }
  },
  
  // 粒子設定
  particles: {
    count: 100,              // 粒子の数
    size: 0.05,              // 粒子のサイズ
    spiralTurns: 6,         // 螺旋の回転数 (Math.PI * spiralTurns)
    spiralRadius: 3,        // 螺旋の半径
    verticalSpread: 6,      // 縦方向の広がり
  },
  
  // アニメーション設定
  animation: {
    timeSpeed: 0.02,        // 時間の進行速度
    rotationSpeed: 0.3,     // 全体の回転速度
    flowAmplitude: 0.6,     // 流れる動きの振幅
  },
  
  // 色設定
  colors: {
    baseColor: 0xcccccc,    // グレー色
    opacity: 0.8,           // 透明度
  }
}

interface FlowVisionProps {
  className?: string
}

export function FlowVision({ className = '' }: FlowVisionProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef<number>(0)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      CONFIG.camera.fov, 
      CONFIG.canvas.width / CONFIG.canvas.height, 
      0.1, 
      1000
    )
    camera.position.set(
      CONFIG.camera.position.x, 
      CONFIG.camera.position.y, 
      CONFIG.camera.position.z
    )

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    })
    renderer.setSize(CONFIG.canvas.width, CONFIG.canvas.height)
    renderer.setClearColor(0x000000, 0)
    
    mountRef.current.appendChild(renderer.domElement)

    // Create main group
    const group = new THREE.Group()
    scene.add(group)

    // 2つの床（レイヤー）を作成
    const floors: THREE.Mesh[] = []
    const floorPositions = [
      2.5,   // 上層（データ集合体）
      -2.5   // 下層（現実世界の課題）
    ]
    
    floorPositions.forEach((yPos, index) => {
      const floorGeometry = new THREE.PlaneGeometry(6, 6)
      const floorMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xcccccc,
        transparent: true,
        opacity: 0.3,
        side: THREE.DoubleSide
      })
      const floor = new THREE.Mesh(floorGeometry, floorMaterial)
      floor.rotation.x = -Math.PI / 2 // 水平に配置
      floor.position.y = yPos
      floors.push(floor)
      group.add(floor)
    })

    // 流れる粒子システム
    const particles: THREE.Mesh[] = []
    
    for (let i = 0; i < CONFIG.particles.count; i++) {
      const geometry = new THREE.SphereGeometry(CONFIG.particles.size, 8, 8)
      const material = new THREE.MeshBasicMaterial({ 
        color: CONFIG.colors.baseColor,
        transparent: true,
        opacity: CONFIG.colors.opacity
      })
      const sphere = new THREE.Mesh(geometry, material)
      
      // 螺旋の流れ
      const t = i / CONFIG.particles.count
      const angle = t * Math.PI * CONFIG.particles.spiralTurns
      const radius = Math.sin(t * Math.PI) * CONFIG.particles.spiralRadius
      const y = (t - 0.5) * CONFIG.particles.verticalSpread
      
      sphere.position.set(
        Math.cos(angle) * radius,
        y,
        Math.sin(angle) * radius
      )
      
      sphere.userData = { 
        originalY: y, 
        phase: t * Math.PI * 2,
        originalAngle: angle,
        originalRadius: radius
      }
      particles.push(sphere)
      group.add(sphere)
    }

    // Animation
    let time = 0
    const animate = () => {
      time += CONFIG.animation.timeSpeed
      
      // 粒子のみの回転（床は回転させない）
      particles.forEach((particle, index) => {
        const originalPosition = new THREE.Vector3(
          Math.cos(particle.userData.originalAngle + time * CONFIG.animation.rotationSpeed) * particle.userData.originalRadius,
          particle.userData.originalY + Math.sin(time + particle.userData.phase) * CONFIG.animation.flowAmplitude,
          Math.sin(particle.userData.originalAngle + time * CONFIG.animation.rotationSpeed) * particle.userData.originalRadius
        )
        particle.position.copy(originalPosition)
      })
      
      
      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }
    
    animate()

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className={className} />
}

// Legacy DiamondCanvas component for backward compatibility
export function DiamondCanvas({ 
  color = '#B8C5FF', 
  intensity = 0.6, 
  className = '' 
}: { 
  color?: string
  intensity?: number
  className?: string 
}) {
  return (
    <FlowVision 
      className={className}
    />
  )
}