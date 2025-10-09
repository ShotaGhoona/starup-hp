'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'

interface InteractiveParticleTextProps {
  className?: string
  text: string
}

export default function InteractiveParticleText({ className = '', text }: InteractiveParticleTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const preload = () => {
      const manager = new THREE.LoadingManager()
      
      manager.onLoad = function() { 
        new Environment(typo, particle)
      }

      let typo: any = null
      let particle: THREE.Texture

      // Create a simple particle texture programmatically
      const canvas = document.createElement('canvas')
      canvas.width = 64
      canvas.height = 64
      const context = canvas.getContext('2d')!
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32)
      gradient.addColorStop(0, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.2, 'rgba(255,255,255,1)')
      gradient.addColorStop(0.4, 'rgba(255,255,255,0.8)')
      gradient.addColorStop(1, 'rgba(255,255,255,0)')
      context.fillStyle = gradient
      context.fillRect(0, 0, 64, 64)
      
      particle = new THREE.CanvasTexture(canvas)

      const loader = new FontLoader(manager)
      
      // Font options - uncomment one to use
      const fontUrls = [
        // 1. Helvetiker Regular (currently active)
        // 'https://threejs.org/examples/fonts/helvetiker_regular.typeface.json',
        
        // 2. Helvetiker Bold
        'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json',
        
        // 3. Optimer Regular
        // 'https://threejs.org/examples/fonts/optimer_regular.typeface.json',
        
        // 4. Optimer Bold
        // 'https://threejs.org/examples/fonts/optimer_bold.typeface.json',
        
        // 5. Gentilis Regular
        // 'https://threejs.org/examples/fonts/gentilis_regular.typeface.json',
      ]
      
      loader.load(
        fontUrls.find(url => url && !url.trim().startsWith('//')) || fontUrls[fontUrls.length - 1], // Use the non-commented font
        function(font) { 
          typo = font
        },
        undefined,
        function(error) {
          // Fallback: create environment without font for now
          new Environment(null, particle)
        }
      )
    }

    class Environment {
      font: any
      particle: THREE.Texture
      container: HTMLDivElement
      scene: THREE.Scene
      camera!: THREE.PerspectiveCamera
      renderer!: THREE.WebGLRenderer
      createParticles!: CreateParticles

      constructor(font: any, particle: THREE.Texture) {
        this.font = font
        this.particle = particle
        this.container = containerRef.current!
        this.scene = new THREE.Scene()
        this.createCamera()
        this.createRenderer()
        this.setup()
        this.bindEvents()
      }

      bindEvents() {
        window.addEventListener('resize', this.onWindowResize.bind(this))
      }

      setup() { 
        this.createParticles = new CreateParticles(
          this.scene, 
          this.font, 
          this.particle, 
          this.camera, 
          this.renderer,
          text
        )
      }

      render() {
        this.createParticles.render()
        this.renderer.render(this.scene, this.camera)
      }

      createCamera() {
        this.camera = new THREE.PerspectiveCamera(
          65, 
          this.container.clientWidth / this.container.clientHeight, 
          1, 
          10000
        )
        this.camera.position.set(0, 0, 100)
      }

      createRenderer() {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.setClearColor(0x000000, 0)
        this.container.appendChild(this.renderer.domElement)
        this.renderer.setAnimationLoop(() => { this.render() })
      }

      onWindowResize() {
        this.camera.aspect = this.container.clientWidth / this.container.clientHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
      }
    }

    class CreateParticles {
      scene: THREE.Scene
      font: any
      particleImg: THREE.Texture
      camera: THREE.PerspectiveCamera
      renderer: THREE.WebGLRenderer
      raycaster: THREE.Raycaster
      mouse: THREE.Vector2
      colorChange: THREE.Color
      buttom: boolean = false
      planeArea!: THREE.Mesh
      particles: THREE.Points | null = null
      geometryCopy: THREE.BufferGeometry | null = null
      currenPosition: THREE.Vector3 | null = null

      data = {
        text: '',
        amount: 1500,
        particleSize: 1,
        particleColor: 0xffffff,
        textSize: 8,
        area: 250,
        ease: 0.05,
      }

      constructor(scene: THREE.Scene, font: any, particleImg: THREE.Texture, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer, text: string) {
        this.scene = scene
        this.font = font
        this.particleImg = particleImg
        this.camera = camera
        this.renderer = renderer
        
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2(-200, 200)
        this.colorChange = new THREE.Color()

        this.data.text = text
        this.setup()
        this.bindEvents()
      }

      setup() {
        // Use fixed size for the interaction plane instead of calculated values
        const geometry = new THREE.PlaneGeometry(1000, 1000)
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true })
        this.planeArea = new THREE.Mesh(geometry, material)
        this.planeArea.visible = false
        this.planeArea.position.z = 0
        this.scene.add(this.planeArea)
        this.createText()
      }

      bindEvents() {
        document.addEventListener('mousedown', this.onMouseDown.bind(this))
        document.addEventListener('mousemove', this.onMouseMove.bind(this))
        document.addEventListener('mouseup', this.onMouseUp.bind(this))
      }

      onMouseDown(event: MouseEvent) {
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

        const vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5)
        vector.unproject(this.camera)
        const dir = vector.sub(this.camera.position).normalize()
        const distance = -this.camera.position.z / dir.z
        this.currenPosition = this.camera.position.clone().add(dir.multiplyScalar(distance))
        
        this.buttom = true
        this.data.ease = 0.01
      }

      onMouseUp() {
        this.buttom = false
        this.data.ease = 0.05
      }

      onMouseMove(event: MouseEvent) { 
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      }

      render() { 
        const time = ((.001 * performance.now()) % 12) / 12
        const zigzagTime = (1 + (Math.sin(time * 2 * Math.PI))) / 6

        this.raycaster.setFromCamera(this.mouse, this.camera)
        const intersects = this.raycaster.intersectObject(this.planeArea)

        if (intersects.length > 0 && this.particles && this.geometryCopy) {
          const pos = this.particles.geometry.attributes.position as THREE.BufferAttribute
          const copy = this.geometryCopy.attributes.position as THREE.BufferAttribute
          const coulors = this.particles.geometry.attributes.customColor as THREE.BufferAttribute
          const size = this.particles.geometry.attributes.size as THREE.BufferAttribute

          const mx = intersects[0].point.x
          const my = intersects[0].point.y
          const mz = intersects[0].point.z

          for (let i = 0, l = pos.count; i < l; i++) {
            const initX = copy.getX(i)
            const initY = copy.getY(i)
            const initZ = copy.getZ(i)

            let px = pos.getX(i)
            let py = pos.getY(i)
            let pz = pos.getZ(i)

            this.colorChange.setHSL(0.5, 1, 1)
            coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
            coulors.needsUpdate = true

            size.array[i] = this.data.particleSize
            size.needsUpdate = true

            let dx = mx - px
            let dy = my - py
            const dz = mz - pz

            const mouseDistance = this.distance(mx, my, px, py)
            let d = (dx = mx - px) * dx + (dy = my - py) * dy
            const f = -this.data.area / d

            if (this.buttom) { 
              const t = Math.atan2(dy, dx)
              px -= f * Math.cos(t)
              py -= f * Math.sin(t)

              this.colorChange.setHSL(0.5 + zigzagTime, 1.0, 0.5)
              coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
              coulors.needsUpdate = true

              if ((px > (initX + 70)) || (px < (initX - 70)) || (py > (initY + 70)) || (py < (initY - 70))) {
                this.colorChange.setHSL(0.15, 1.0, 0.5)
                coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
                coulors.needsUpdate = true
              }
            } else {
              if (mouseDistance < this.data.area) {
                if (i % 5 === 0) {
                  const t = Math.atan2(dy, dx)
                  px -= 0.03 * Math.cos(t)
                  py -= 0.03 * Math.sin(t)

                  this.colorChange.setHSL(0.15, 1.0, 0.5)
                  coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
                  coulors.needsUpdate = true

                  size.array[i] = this.data.particleSize / 1.2
                  size.needsUpdate = true
                } else {
                  const t = Math.atan2(dy, dx)
                  px += f * Math.cos(t)
                  py += f * Math.sin(t)

                  pos.setXYZ(i, px, py, pz)
                  pos.needsUpdate = true

                  size.array[i] = this.data.particleSize * 1.3
                  size.needsUpdate = true
                }

                if ((px > (initX + 10)) || (px < (initX - 10)) || (py > (initY + 10)) || (py < (initY - 10))) {
                  this.colorChange.setHSL(0.15, 1.0, 0.5)
                  coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
                  coulors.needsUpdate = true

                  size.array[i] = this.data.particleSize / 1.8
                  size.needsUpdate = true
                }
              }
            }

            px += (initX - px) * this.data.ease
            py += (initY - py) * this.data.ease
            pz += (initZ - pz) * this.data.ease

            pos.setXYZ(i, px, py, pz)
            pos.needsUpdate = true
          }
        }
      }

      createMarkers() {
        if (!this.font) return
        
        // テキストの行を分割
        const lines = this.data.text.split('\n')
        const lineHeight = this.data.textSize * 2.0
        
        // 全行の境界を計算して最大幅を求める
        let maxWidth = 0
        const lineData: { width: number; height: number; yOffset: number }[] = []
        
        lines.forEach((line, index) => {
          const shapes = this.font.generateShapes(line, this.data.textSize)
          const geometry = new THREE.ShapeGeometry(shapes)
          geometry.computeBoundingBox()
          
          if (geometry.boundingBox) {
            const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x
            const textHeight = geometry.boundingBox.max.y - geometry.boundingBox.min.y
            const yOffset = (index - (lines.length - 1) / 2) * lineHeight
            
            maxWidth = Math.max(maxWidth, textWidth)
            lineData.push({ width: textWidth, height: textHeight, yOffset })
          }
        })
        
        // 各行のマーカーを左揃えで作成
        lineData.forEach((data) => {
          const markerWidth = data.width + 15
          const markerHeight = data.height + 8
          
          const markerGeometry = new THREE.PlaneGeometry(markerWidth, markerHeight)
          const markerMaterial = new THREE.MeshBasicMaterial({ 
            color: 0x000000, 
            transparent: true, 
            opacity: 0.8 
          })
          
          const marker = new THREE.Mesh(markerGeometry, markerMaterial)
          // 左揃えにするため、最大幅との差分を計算してオフセット
          const leftOffset = -(maxWidth - data.width) / 2
          marker.position.set(leftOffset, data.yOffset, -1)
          this.scene.add(marker)
        })
      }

      createText() { 
        const thePoints: THREE.Vector3[] = []
        const colors: number[] = []
        const sizes: number[] = []

        if (!this.font) {
          // Fallback: create a simple grid of particles to test
          for (let x = -50; x <= 50; x += 5) {
            for (let y = -20; y <= 20; y += 5) {
              thePoints.push(new THREE.Vector3(x, y, 0))
              colors.push(1, 1, 1) // White color
              sizes.push(2)
            }
          }
        } else {
          // まず黒マーカーを作成
          this.createMarkers()
          
          // テキストの行を分割して処理
          const lines = this.data.text.split('\n')
          const lineHeight = this.data.textSize * 2.0
          
          lines.forEach((line, lineIndex) => {
            const shapes = this.font.generateShapes(line, this.data.textSize)
            const geometry = new THREE.ShapeGeometry(shapes)
            geometry.computeBoundingBox()

            const holeShapes: any[] = []

            for (let q = 0; q < shapes.length; q++) {
              const shape = shapes[q]

              if (shape.holes && shape.holes.length > 0) {
                for (let j = 0; j < shape.holes.length; j++) {
                  const hole = shape.holes[j]
                  holeShapes.push(hole)
                }
              }
            }
            shapes.push.apply(shapes, holeShapes)
                        
            for (let x = 0; x < shapes.length; x++) {
              const shape = shapes[x]
              const amountPoints = (shape.type === 'Path') ? this.data.amount / 2 : this.data.amount
              const points = shape.getSpacedPoints(amountPoints)

              points.forEach((element: any) => {
                const yOffset = (lineIndex - (lines.length - 1) / 2) * lineHeight
                const a = new THREE.Vector3(element.x, element.y + yOffset, 0)
                thePoints.push(a)
                colors.push(1, 1, 1) // White color
                sizes.push(1)
              })
            }
          })
        }


        const geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints)
        // センターに配置
        geoParticles.center()
                
        geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3))
        geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

        // Create shaders inline as in the original
        const material = new THREE.ShaderMaterial({
          uniforms: {
            color: { value: new THREE.Color(0xffffff) },
            pointTexture: { value: this.particleImg }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 customColor;
            varying vec3 vColor;

            void main() {
              vColor = customColor;
              vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
              gl_PointSize = size * ( 300.0 / -mvPosition.z );
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform vec3 color;
            uniform sampler2D pointTexture;
            varying vec3 vColor;

            void main() {
              gl_FragColor = vec4( color * vColor, 1.0 );
              gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
            }
          `,
          blending: THREE.AdditiveBlending,
          depthTest: false,
          transparent: true,
        })

        this.particles = new THREE.Points(geoParticles, material)
        this.scene.add(this.particles)

        this.geometryCopy = new THREE.BufferGeometry()
        this.geometryCopy.copy(this.particles.geometry)
      }

      visibleHeightAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
        const cameraOffset = camera.position.z
        const actualDepth = Math.abs(depth - cameraOffset)
        
        if (actualDepth === 0) return 0
        
        const vFOV = camera.fov * Math.PI / 180 
        return 2 * Math.tan(vFOV / 2) * actualDepth
      }

      visibleWidthAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
        const height = this.visibleHeightAtZDepth(depth, camera)
        return height * camera.aspect
      }

      distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
      }
    }

    if (document.readyState === "complete" || (document.readyState !== "loading" && !document.documentElement.scroll)) {
      preload()
    } else {
      document.addEventListener("DOMContentLoaded", preload)
    }

  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}