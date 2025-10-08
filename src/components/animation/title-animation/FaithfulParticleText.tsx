'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { Font } from 'three/examples/jsm/loaders/FontLoader.js'
import { PARTICLE_TEXT_CONFIG, type ParticleTextConfig } from './config'

interface FaithfulParticleTextProps {
  className?: string
  config?: Partial<ParticleTextConfig>
}

const FaithfulParticleText: React.FC<FaithfulParticleTextProps> = ({
  className = '',
  config: customConfig = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // マージ設定
    const config = {
      ...PARTICLE_TEXT_CONFIG,
      ...customConfig,
      text: { ...PARTICLE_TEXT_CONFIG.text, ...customConfig.text },
      particle: { ...PARTICLE_TEXT_CONFIG.particle, ...customConfig.particle },
      colors: { 
        ...PARTICLE_TEXT_CONFIG.colors, 
        ...customConfig.colors,
        base: { ...PARTICLE_TEXT_CONFIG.colors.base, ...customConfig.colors?.base },
        interaction: { ...PARTICLE_TEXT_CONFIG.colors.interaction, ...customConfig.colors?.interaction }
      },
      animation: { ...PARTICLE_TEXT_CONFIG.animation, ...customConfig.animation },
      camera: { 
        ...PARTICLE_TEXT_CONFIG.camera, 
        ...customConfig.camera,
        position: { ...PARTICLE_TEXT_CONFIG.camera.position, ...customConfig.camera?.position }
      },
      renderer: { ...PARTICLE_TEXT_CONFIG.renderer, ...customConfig.renderer },
      fonts: { ...PARTICLE_TEXT_CONFIG.fonts, ...customConfig.fonts },
      texture: { ...PARTICLE_TEXT_CONFIG.texture, ...customConfig.texture },
      interaction: { ...PARTICLE_TEXT_CONFIG.interaction, ...customConfig.interaction },
    }

    const preload = () => {
      const manager = new THREE.LoadingManager()
      manager.onLoad = function() { 
        new Environment(typo, particle)
      }

      let typo: Font | null = null
      const loader = new FontLoader(manager)
      
      // Try multiple font sources from config
      const fontUrls = config.fonts.urls
      
      let currentIndex = 0
      const tryFont = () => {
        if (currentIndex >= fontUrls.length) {
          console.error('All fonts failed to load')
          return
        }
        
        loader.load(
          fontUrls[currentIndex],
          function(font) { 
            typo = font
            console.log(`Loaded font: ${fontUrls[currentIndex]}`)
          },
          undefined,
          function() {
            console.warn(`Font failed: ${fontUrls[currentIndex]}`)
            currentIndex++
            tryFont()
          }
        )
      }
      
      tryFont()
      
      const particle = new THREE.TextureLoader(manager).load(config.texture.url)
    }

    class Environment {
      font: Font | null
      particle: THREE.Texture
      container: HTMLDivElement
      scene: THREE.Scene
      camera: THREE.PerspectiveCamera | null = null
      renderer: THREE.WebGLRenderer | null = null
      createParticles: CreateParticles | null = null

      constructor(font: Font | null, particle: THREE.Texture) {
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
        if (this.font && this.particle && this.camera && this.renderer) {
          this.createParticles = new CreateParticles(
            this.scene, 
            this.font, 
            this.particle, 
            this.camera, 
            this.renderer
          )
        }
      }

      render() {
        if (this.createParticles) {
          this.createParticles.render()
        }
        if (this.renderer && this.camera) {
          this.renderer.render(this.scene, this.camera)
        }
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
        this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
        this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.renderer.outputColorSpace = THREE.SRGBColorSpace
        this.renderer.setClearColor(0x000000, 0) // Set transparent background
        this.container.appendChild(this.renderer.domElement)
        this.renderer.setAnimationLoop(() => { this.render() })
      }

      onWindowResize() {
        if (this.camera && this.renderer) {
          this.camera.aspect = this.container.clientWidth / this.container.clientHeight
          this.camera.updateProjectionMatrix()
          this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
        }
      }
    }

    class CreateParticles {
      scene: THREE.Scene
      font: Font
      particleImg: THREE.Texture
      camera: THREE.PerspectiveCamera
      renderer: THREE.WebGLRenderer
      raycaster: THREE.Raycaster
      mouse: THREE.Vector2
      colorChange: THREE.Color
      buttom: boolean = false
      planeArea: THREE.Mesh | null = null
      particles: THREE.Points | null = null
      geometryCopy: THREE.BufferGeometry | null = null
      currenPosition: THREE.Vector3 | null = null

      data = {
        text: config.text.content,
        amount: config.particle.amount,
        particleSize: config.particle.baseSize,
        particleColor: 0xffffff,
        textSize: config.text.size,
        area: config.animation.area,
        ease: config.animation.easeNormal as number,
      }

      constructor(scene: THREE.Scene, font: Font, particleImg: THREE.Texture, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) {
        this.scene = scene
        this.font = font
        this.particleImg = particleImg
        this.camera = camera
        this.renderer = renderer
        
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2(-200, 200)
        this.colorChange = new THREE.Color()

        this.setup()
        this.bindEvents()
      }

      setup() {
        const geometry = new THREE.PlaneGeometry(
          this.visibleWidthAtZDepth(100, this.camera), 
          this.visibleHeightAtZDepth(100, this.camera)
        )
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true })
        this.planeArea = new THREE.Mesh(geometry, material)
        this.planeArea.visible = false
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
        this.data.ease = config.animation.easePressed
      }

      onMouseUp() {
        this.buttom = false
        this.data.ease = config.animation.easeNormal
      }

      onMouseMove(event: MouseEvent) { 
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
      }

      render() { 
        // const time = ((.001 * performance.now()) % 12) / 12
        // const zigzagTime = (1 + (Math.sin(time * 2 * Math.PI))) / 6

        this.raycaster.setFromCamera(this.mouse, this.camera)
        
        if (!this.planeArea) return
        const intersects = this.raycaster.intersectObject(this.planeArea)

        if (intersects.length > 0 && this.particles && this.geometryCopy) {
          const pos = this.particles.geometry.attributes.position
          const copy = this.geometryCopy.attributes.position
          const coulors = this.particles.geometry.attributes.customColor
          const size = this.particles.geometry.attributes.size

          const mx = intersects[0].point.x
          const my = intersects[0].point.y
          // const mz = intersects[0].point.z

          for (let i = 0, l = pos.count; i < l; i++) {
            const initX = copy.getX(i)
            const initY = copy.getY(i)
            const initZ = copy.getZ(i)

            let px = pos.getX(i)
            let py = pos.getY(i)
            let pz = pos.getZ(i)

            this.colorChange.setHSL(0, 0, 0) // Black color (base)
            coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
            coulors.needsUpdate = true

            size.array[i] = this.data.particleSize
            size.needsUpdate = true

            const dx = mx - px
            const dy = my - py
            const mouseDistance = this.distance(mx, my, px, py)
            const d = (dx) * dx + (dy) * dy
            const f = -this.data.area / d

            if (this.buttom) { 
              const t = Math.atan2(dy, dx)
              px -= f * Math.cos(t)
              py -= f * Math.sin(t)

              this.colorChange.setHSL(0, 0, 0) // Black color (interaction)
              coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
              coulors.needsUpdate = true

              if ((px > (initX + 70)) || (px < (initX - 70)) || (py > (initY + 70)) || (py < (initY - 70))) {
                this.colorChange.setHSL(0.15, 1.0, 0.5) // Yellow color (background)
                coulors.setXYZ(i, this.colorChange.r, this.colorChange.g, this.colorChange.b)
                coulors.needsUpdate = true
              }
            } else {
              if (mouseDistance < this.data.area) {
                if (i % 5 === 0) {
                  const t = Math.atan2(dy, dx)
                  px -= 0.03 * Math.cos(t)
                  py -= 0.03 * Math.sin(t)

                  this.colorChange.setHSL(0.15, 1.0, 0.5) // Yellow color (hover effect)
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
                  this.colorChange.setHSL(0.15, 1.0, 0.5) // Yellow color (displaced particles)
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

      createText() { 
        const thePoints: THREE.Vector3[] = []
        const colors: number[] = []
        const sizes: number[] = []
        
        // Split text into lines and process each separately
        const lines = this.data.text.split('\n')
        const lineSpacing = 20 // Adjust this value to control line spacing
        
        lines.forEach((line, lineIndex) => {
          const shapes = this.font.generateShapes(line, this.data.textSize)
          const geometry = new THREE.ShapeGeometry(shapes)
          geometry.computeBoundingBox()

          const holeShapes: THREE.Path[] = []

          for (let q = 0; q < shapes.length; q++) {
            const shape = shapes[q]

            if (shape.holes && shape.holes.length > 0) {
              for (let j = 0; j < shape.holes.length; j++) {
                const hole = shape.holes[j]
                holeShapes.push(hole)
              }
            }
          }
          shapes.push(...(holeShapes as THREE.Shape[]))
                      
          for (let x = 0; x < shapes.length; x++) {
            const shape = shapes[x]
            const amountPoints = (shape.type === 'Path') ? this.data.amount / 2 : this.data.amount
            const points = shape.getSpacedPoints(amountPoints)

            points.forEach((element) => {
              // Calculate position with custom line spacing
              const yOffset = (lineIndex - (lines.length - 1) / 2) * lineSpacing
              const a = new THREE.Vector3(element.x, element.y + yOffset, 0)
              thePoints.push(a)
              
              // Set initial black color
              this.colorChange.setHSL(0, 0, 0) // Black (base color)
              colors.push(this.colorChange.r, this.colorChange.g, this.colorChange.b)
              sizes.push(1.5) // Even smaller particle size for thinner outline
            })
          }
        })

        const geoParticles = new THREE.BufferGeometry().setFromPoints(thePoints)
        // Center the geometry
        geoParticles.center()
                
        geoParticles.setAttribute('customColor', new THREE.Float32BufferAttribute(colors, 3))
        geoParticles.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))

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
              gl_FragColor = vec4( vColor, 1.0 );
              gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
            }
          `,
          blending: THREE.NormalBlending,
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
        if (depth < cameraOffset) depth -= cameraOffset
        else depth += cameraOffset

        const vFOV = camera.fov * Math.PI / 180
        return 2 * Math.tan(vFOV / 2) * Math.abs(depth)
      }

      visibleWidthAtZDepth(depth: number, camera: THREE.PerspectiveCamera) {
        const height = this.visibleHeightAtZDepth(depth, camera)
        return height * camera.aspect
      }

      distance(x1: number, y1: number, x2: number, y2: number) {
        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2))
      }
    }

    if (document.readyState === "complete" || document.readyState !== "loading") {
      preload()
    } else {
      document.addEventListener("DOMContentLoaded", preload)
    }

  }, [customConfig])

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full ${className}`}
      style={{ minHeight: '100vh' }}
    />
  )
}

export default FaithfulParticleText