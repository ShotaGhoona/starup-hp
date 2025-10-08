'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

interface SphereScanProps {
  className?: string
}

export default function SphereScan({ className = '' }: SphereScanProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const animationIdRef = useRef<number>(0)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    
    const updateSize = () => {
      if (!mountRef.current) return
      const width = mountRef.current.offsetWidth
      const height = mountRef.current.offsetHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    
    updateSize()
    mountRef.current.appendChild(renderer.domElement)

    // Generate sphere points using fibonacci sphere distribution
    const numDots = 400 // 250 * 1.5
    const radius = 4.0 // Equivalent to CANVAS_WIDTH * 0.4 scaled for 3D
    const spherePoints: THREE.Vector3[] = []
    
    for (let i = 0; i < numDots; i++) {
      const theta = Math.acos(1 - 2 * (i / numDots))
      const phi = Math.sqrt(numDots * Math.PI) * theta
      
      spherePoints.push(new THREE.Vector3(
        radius * Math.sin(theta) * Math.cos(phi),
        radius * Math.sin(theta) * Math.sin(phi),
        radius * Math.cos(theta)
      ))
    }

    // Create particle system
    const positions: number[] = []
    const colors: number[] = []
    const sizes: number[] = []
    
    spherePoints.forEach(point => {
      positions.push(point.x, point.y, point.z)
      colors.push(0.2, 0.2, 0.2) // Dark gray
      sizes.push(1)
    })

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0.0 },
        scanPosition: { value: 0.0 },
        scanWidth: { value: 1.0 },
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        varying vec3 vPosition;
        varying float vDistanceToScan;
        uniform float time;
        uniform float scanPosition;
        uniform float scanWidth;
        
        void main() {
          vColor = color;
          vPosition = position;
          
          // Apply rotations
          vec3 pos = position;
          float rotX = sin(time * 0.3) * 0.5;
          float rotY = time * 0.5;
          
          // Rotate around Y axis
          float cosY = cos(rotY);
          float sinY = sin(rotY);
          float newX = pos.x * cosY - pos.z * sinY;
          float newZ = pos.x * sinY + pos.z * cosY;
          pos.x = newX;
          pos.z = newZ;
          
          // Rotate around X axis
          float cosX = cos(rotX);
          float sinX = sin(rotX);
          float newY = pos.y * cosX - pos.z * sinX;
          newZ = pos.y * sinX + pos.z * cosX;
          pos.y = newY;
          pos.z = newZ;
          
          // Calculate distance to scan line
          vDistanceToScan = abs(pos.y - scanPosition);
          
          // Scale based on depth (equivalent to original: (z + radius * 1.5) / (radius * 2.5))
          float scale = (pos.z + 6.0) / 10.0;
          
          // Calculate scan influence
          float scanInfluence = 0.0;
          if (vDistanceToScan < scanWidth) {
            scanInfluence = cos((vDistanceToScan / scanWidth) * (3.14159 / 2.0));
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          float finalSize = max(0.0, scale * size * 0.8 + scanInfluence * 1.5);
          gl_PointSize = finalSize * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vDistanceToScan;
        uniform float scanWidth;
        
        void main() {
          vec2 center = 2.0 * gl_PointCoord - 1.0;
          float dist = length(center);
          if (dist > 0.8) discard;
          
          // Calculate scan influence for opacity
          float scanInfluence = 0.0;
          if (vDistanceToScan < scanWidth) {
            scanInfluence = cos((vDistanceToScan / scanWidth) * (3.14159 / 2.0));
          }
          
          // More solid, less blurry appearance
          float alpha = 1.0 - smoothstep(0.0, 0.8, dist);
          alpha = pow(alpha, 0.8);
          
          // Base opacity with scan enhancement
          float finalOpacity = max(0.4, alpha * (0.6 + scanInfluence * 0.4));
          
          // Enhanced darkness for scanned particles (inverted effect)
          vec3 finalColor = vColor * (1.0 - scanInfluence * 0.8);
          
          gl_FragColor = vec4(finalColor, finalOpacity);
        }
      `,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    })

    const particleSystem = new THREE.Points(geometry, material)
    scene.add(particleSystem)

    // Animation variables
    let time = 0
    let lastTime = 0

    // Smooth easing function
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    }

    const animate = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp
      const deltaTime = timestamp - lastTime
      lastTime = timestamp
      time += deltaTime * 0.0005 * 0.5 // Global speed multiplier

      // Calculate scan position with smooth easing
      const easedTime = easeInOutCubic((Math.sin(time * 2.5) + 1) / 2)
      const scanPosition = (easedTime * 2 - 1) * radius
      const scanWidth = 1.0 // Equivalent to 25 in original canvas scale

      // Update uniforms
      material.uniforms.time.value = time
      material.uniforms.scanPosition.value = scanPosition
      material.uniforms.scanWidth.value = scanWidth

      renderer.render(scene, camera)
      animationIdRef.current = requestAnimationFrame(animate)
    }

    animate(0)

    // Handle resize
    window.addEventListener('resize', updateSize)

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      window.removeEventListener('resize', updateSize)
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return <div ref={mountRef} className={`w-full h-full ${className}`} />
}