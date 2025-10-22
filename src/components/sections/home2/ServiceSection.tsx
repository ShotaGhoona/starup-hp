"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import * as THREE from 'three'
import ViewMoreLink from "../../ui/ViewMoreLink"

gsap.registerPlugin(ScrollTrigger)

export default function ServiceSection() {
    const sectionRef = useRef<HTMLElement>(null)
    const titleRef = useRef<HTMLDivElement>(null)
    const descriptionRef = useRef<HTMLDivElement>(null)
    const service1CardRef = useRef<HTMLDivElement>(null)
    const service2CardRef = useRef<HTMLDivElement>(null)
    const service3CardRef = useRef<HTMLDivElement>(null)
    
    // Three.js refs
    const containerRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<THREE.Scene | null>(null)
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
    const composerRef = useRef<any>(null)
    const clockRef = useRef<THREE.Clock>(new THREE.Clock())
    const animationIdRef = useRef<number | null>(null)
    const meshesRef = useRef<THREE.Object3D[]>([])
    const materialsRef = useRef<THREE.Material[]>([])
    const portalMaterialsRef = useRef<any[]>([])
    const portalLightsRef = useRef<THREE.PointLight[]>([])
    const timeRef = useRef(0)
    const initialCameraPositionRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 15))

    // 表示制御用のrefs
    const spiralMeshesRef = useRef<THREE.Object3D[]>([])
    const particleMeshesRef = useRef<THREE.Object3D[]>([])

    const [isLoading, setIsLoading] = useState(true)

    const [params] = useState({
        primaryColor: '#9b59b6',
        secondaryColor: '#3498db',
        accentColor: '#e74c3c',
        vortexColor: '#2ecc71',
        rotationSpeed: 0.3,
        bloomEnabled: true,
        bloomStrength: 1.2,
        bloomRadius: 0.7,
        bloomThreshold: 0.2,
        portalIntensity: 1.0,
        dimensionShift: 0
    })

    const addPortalShader = useCallback((material: THREE.Material) => {
        if ('onBeforeCompile' in material) {
            (material as any).onBeforeCompile = (shader: any) => {
                shader.uniforms.time = { value: 0 }
                shader.uniforms.pulseTime = { value: -1000 }
                shader.uniforms.portalSpeed = { value: 8.0 }
                shader.uniforms.portalColor = { value: new THREE.Color(params.accentColor) }
                shader.uniforms.dimensionShift = { value: 0 }
                
                shader.vertexShader = `varying vec3 vWorldPosition;\n` + shader.vertexShader
                
                shader.fragmentShader = `
                    uniform float time;
                    uniform float pulseTime;
                    uniform float portalSpeed;
                    uniform vec3 portalColor;
                    uniform float dimensionShift;
                    varying vec3 vWorldPosition;\n` + shader.fragmentShader
                
                shader.vertexShader = shader.vertexShader.replace(
                    '#include <begin_vertex>',
                    `
                    #include <begin_vertex>
                    vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
                    `
                )
                
                shader.fragmentShader = shader.fragmentShader.replace(
                    '#include <emissivemap_fragment>',
                    `#include <emissivemap_fragment>
                    float timeSincePortal = time - pulseTime;
                    if(timeSincePortal > 0.0 && timeSincePortal < 3.0) {
                        float portalRadius = timeSincePortal * portalSpeed;
                        float currentRadius = length(vWorldPosition);
                        float portalWidth = 1.5;
                        float portalEffect = smoothstep(portalRadius - portalWidth, portalRadius, currentRadius) - 
                                             smoothstep(portalRadius, portalRadius + portalWidth, currentRadius);
                        vec3 dimensionalColor = mix(portalColor, vec3(1.0, 0.5, 1.0), sin(dimensionShift * 3.14159) * 0.5 + 0.5);
                        totalEmissiveRadiance += dimensionalColor * portalEffect * 4.0;
                    }`
                )
                portalMaterialsRef.current.push(shader)
            }
        }
    }, [params.accentColor])

    const getRingColor = useCallback((ring: number) => {
        const colors = [params.primaryColor, params.secondaryColor, params.accentColor, params.vortexColor]
        return colors[ring % colors.length]
    }, [params.primaryColor, params.secondaryColor, params.accentColor, params.vortexColor])

    const getStreamColor = useCallback((index: number) => {
        const colors = [params.vortexColor, params.primaryColor, params.secondaryColor]
        return colors[index % colors.length]
    }, [params.vortexColor, params.primaryColor, params.secondaryColor])

    const createPortalCore = useCallback(() => {
        if (!sceneRef.current) return

        const geo = new THREE.SphereGeometry(2.4, 32, 32) // 元のサイズに戻す
        const mat = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                pulseTime: { value: -1000 },
                dimensionShift: { value: 0 },
                color1: { value: new THREE.Color(params.primaryColor) },
                color2: { value: new THREE.Color(params.secondaryColor) },
                color3: { value: new THREE.Color(params.accentColor) }
            },
            vertexShader: `
                uniform float time;
                uniform float dimensionShift;
                varying vec3 vPos;
                varying vec3 vNorm;
                void main() {
                    vPos = position;
                    vNorm = normal;
                    float warp = sin(position.x * 10.0 + time * 3.0) * 0.1;
                    float shift = sin(dimensionShift * 6.28318) * 0.3;
                    vec3 p = position * (1.0 + warp + shift);
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform float pulseTime;
                uniform float dimensionShift;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                varying vec3 vPos;
                varying vec3 vNorm;
                void main() {
                    float noise = sin(vPos.x * 20.0 + time * 4.0) * cos(vPos.z * 15.0 + time * 3.0);
                    vec3 baseColor = mix(color1, color2, 0.5 + 0.5 * sin(time * 2.0 + dimensionShift));
                    vec3 finalColor = mix(baseColor, color3, noise * 0.3);
                    
                    float fresnel = pow(1.0 - abs(dot(vNorm, normalize(cameraPosition - vPos))), 3.0);
                    finalColor = mix(finalColor, vec3(1.0), fresnel * 0.5);
                    
                    float timeSincePortal = time - pulseTime;
                    if(timeSincePortal > 0.0 && timeSincePortal < 1.0) {
                        float burst = 1.0 - timeSincePortal;
                        finalColor += vec3(1.0) * burst * 3.0;
                    }
                    
                    gl_FragColor = vec4(finalColor, 0.9);
                }
            `,
            transparent: true
        })
        portalMaterialsRef.current.push(mat)
        const mesh = new THREE.Mesh(geo, mat)
        sceneRef.current.add(mesh)
        meshesRef.current.push(mesh)
    }, [params.primaryColor, params.secondaryColor, params.accentColor])

    const createVortexRings = useCallback(() => {
        if (!sceneRef.current) return

        for (let ring = 0; ring < 5; ring++) {
            const radius = 2 + ring * 0.8
            const geo = new THREE.TorusGeometry(radius, 0.05, 16, 64)
            const mat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#e8e8e8'),
                transparent: true, 
                opacity: 0.7, 
                metalness: 0.8, 
                roughness: 0.2,
                clearcoat: 0.8, 
                clearcoatRoughness: 0.1,
                emissive: new THREE.Color('#ffffff').multiplyScalar(0.2)
            })
            addPortalShader(mat)
            const mesh = new THREE.Mesh(geo, mat)
            mesh.rotation.x = Math.PI * 0.1 * ring
            mesh.rotation.z = Math.PI * 0.15 * ring
            sceneRef.current.add(mesh)
            meshesRef.current.push(mesh)
        }
    }, [getRingColor, addPortalShader])

    const createDimensionalStreams = useCallback(() => {
        if (!sceneRef.current) return

        const streamCount = 8
        for (let i = 0; i < streamCount; i++) {
            const points = []
            const segments = 120
            
            for (let j = 0; j <= segments; j++) {
                const t = j / segments
                const angle = t * Math.PI * 12 + i * Math.PI * 0.25
                const radius = 3 + Math.sin(t * Math.PI * 6) * 1.5
                const height = (t - 0.5) * 15
                
                points.push(new THREE.Vector3(
                    Math.cos(angle) * radius,
                    height,
                    Math.sin(angle) * radius
                ))
            }
            
            const curve = new THREE.CatmullRomCurve3(points)
            const geo = new THREE.TubeGeometry(curve, segments, 0.02, 8, false)
            const mat = new THREE.MeshPhysicalMaterial({
                color: new THREE.Color('#e8e8e8'),
                transparent: true, 
                opacity: 0.3, 
                metalness: 1.0, 
                roughness: 0.0,
                emissive: new THREE.Color('#ffffff').multiplyScalar(0.2)
            })
            addPortalShader(mat)
            
            const stream = new THREE.Mesh(geo, mat)
            sceneRef.current.add(stream)
            meshesRef.current.push(stream)
            spiralMeshesRef.current.push(stream)
        }
    }, [getStreamColor, addPortalShader])

    const createEnergyParticles = useCallback(() => {
        if (!sceneRef.current) return

        const count = 500
        const geo = new THREE.BufferGeometry()
        const positions = new Float32Array(count * 3)
        const velocities = new Float32Array(count * 3)
        const colors = new Float32Array(count * 3)
        
        const serviceColors = [
            new THREE.Color('#3498db'),
            new THREE.Color('#5dade2'),
            new THREE.Color('#9b59b6'),
            new THREE.Color('#bb8fce'),
            new THREE.Color('#2980b9')
        ]
        
        // 最初は白色で初期化
        const whiteColor = new THREE.Color('#ffffff')
        
        for (let i = 0; i < count; i++) {
            const r = 3 + Math.random() * 6
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos(2 * Math.random() - 1)
            
            positions[i*3] = r * Math.sin(phi) * Math.cos(theta)
            positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta)
            positions[i*3+2] = r * Math.cos(phi)
            
            velocities[i*3] = (Math.random() - 0.5) * 0.03
            velocities[i*3+1] = (Math.random() - 0.5) * 0.03
            velocities[i*3+2] = (Math.random() - 0.5) * 0.03
            
            // 最初は白色に設定
            whiteColor.toArray(colors, i * 3)
        }
        
        // 各粒子の最終的な色を保存（後でアニメーション用に使用）
        const finalColors = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const colorIndex = Math.floor(Math.random() * serviceColors.length)
            serviceColors[colorIndex].toArray(finalColors, i * 3)
        }
        geo.userData = { finalColors } // 最終色をgeometryに保存
        
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3))
        geo.setAttribute('color', new THREE.BufferAttribute(colors, 3))
        
        const mat = new THREE.PointsMaterial({
            size: 0.15,
            vertexColors: true,
            blending: THREE.AdditiveBlending, 
            transparent: true, 
            opacity: 0.6
        })
        
        const particles = new THREE.Points(geo, mat)
        sceneRef.current.add(particles)
        meshesRef.current.push(particles)
        particleMeshesRef.current.push(particles)
        materialsRef.current.push(mat)
    }, [])

    useEffect(() => {
        if (!containerRef.current) return

        const initScene = async () => {
            // Scene setup
            const scene = new THREE.Scene()
            scene.background = new THREE.Color(0x0a0015)
            scene.fog = new THREE.FogExp2(0x1a0033, 0.001)
            sceneRef.current = scene

            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
            camera.position.set(0, 0, 10) // 15から10に変更してカメラを近づける
            camera.lookAt(0, 0, 0) // 初期は中央を向く
            initialCameraPositionRef.current = camera.position.clone()
            cameraRef.current = camera

            scene.add(new THREE.AmbientLight(0x330066, 0.2))
            
            const mainLight = new THREE.DirectionalLight(0xffffff, 0.6)
            mainLight.position.set(10, 10, 5)
            scene.add(mainLight)

            // Portal lights
            const lightColors = [params.primaryColor, params.secondaryColor, params.accentColor, params.vortexColor]
            
            for (let i = 0; i < 6; i++) {
                const light = new THREE.PointLight(new THREE.Color(lightColors[i % 4]), 0.8, 20)
                scene.add(light)
                portalLightsRef.current.push(light)
            }

            const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' })
            renderer.setSize(window.innerWidth, window.innerHeight)
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
            renderer.outputColorSpace = THREE.SRGBColorSpace
            renderer.toneMapping = THREE.ACESFilmicToneMapping
            renderer.toneMappingExposure = 1.2
            rendererRef.current = renderer
            containerRef.current!.appendChild(renderer.domElement)

            // Load post-processing
            const [
                { EffectComposer },
                { RenderPass },
                { UnrealBloomPass },
                { ShaderPass },
                { FXAAShader }
            ] = await Promise.all([
                import('three/examples/jsm/postprocessing/EffectComposer.js'),
                import('three/examples/jsm/postprocessing/RenderPass.js'),
                import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
                import('three/examples/jsm/postprocessing/ShaderPass.js'),
                import('three/examples/jsm/shaders/FXAAShader.js')
            ])

            const composer = new EffectComposer(renderer)
            composer.addPass(new RenderPass(scene, camera))

            const bloomPass = new UnrealBloomPass(
                new THREE.Vector2(window.innerWidth, window.innerHeight),
                params.bloomStrength, 
                params.bloomRadius, 
                params.bloomThreshold
            )
            composer.addPass(bloomPass)

            const fxaaPass = new ShaderPass(FXAAShader)
            const pixelRatio = renderer.getPixelRatio()
            fxaaPass.material.uniforms['resolution'].value.set(
                1 / (window.innerWidth * pixelRatio), 
                1 / (window.innerHeight * pixelRatio)
            )
            composer.addPass(fxaaPass)
            composerRef.current = composer

            // Create portal scene
            createPortalCore()
            createVortexRings()
            createDimensionalStreams()
            createEnergyParticles()
            
            // 最初からすべて表示（壮大なCGを最初から見せる）
            
            setIsLoading(false)
        }

        initScene()

        const animate = () => {
            const delta = clockRef.current.getDelta()
            timeRef.current = clockRef.current.getElapsedTime()
            
            // Update portal materials
            portalMaterialsRef.current.forEach((shader: any) => {
                if (shader.uniforms) {
                    if (shader.uniforms.time) shader.uniforms.time.value = timeRef.current
                    if (shader.uniforms.dimensionShift) shader.uniforms.dimensionShift.value = params.dimensionShift
                }
            })
            
            // Update regular materials
            materialsRef.current.forEach((mat: any) => {
                if ('uniforms' in mat && mat.uniforms) {
                    if (mat.uniforms.time) mat.uniforms.time.value = timeRef.current
                    if (mat.uniforms.dimensionShift) mat.uniforms.dimensionShift.value = params.dimensionShift
                }
            })
            
            // Update portal lights
            portalLightsRef.current.forEach((light, i) => {
                const angle = timeRef.current * 0.3 + (i / 6) * Math.PI * 2
                const radius = 10 + Math.sin(timeRef.current * 0.5 + i) * 3
                light.position.x = Math.cos(angle) * radius
                light.position.z = Math.sin(angle) * radius
                light.position.y = Math.sin(timeRef.current * 0.4 + i * 0.7) * 5
            })
            
            // Update meshes
            meshesRef.current.forEach((mesh: any, i) => {
                if (!mesh.rotation) return
                const speed = params.rotationSpeed
                mesh.rotation.y += delta * speed * (i % 2 ? -1 : 1) * 0.3
                mesh.rotation.x += delta * speed * 0.1
                
                if (mesh.material && mesh.material.type === 'PointsMaterial') {
                    const geometry = mesh.geometry as THREE.BufferGeometry
                    const positions = geometry.attributes.position.array as Float32Array
                    for (let j = 0; j < positions.length; j += 3) {
                        positions[j] += Math.sin(timeRef.current + j) * 0.001
                        positions[j+1] += Math.cos(timeRef.current + j) * 0.001
                        positions[j+2] += Math.sin(timeRef.current * 0.7 + j) * 0.001
                    }
                    geometry.attributes.position.needsUpdate = true
                }
            })
            
            if (composerRef.current) {
                composerRef.current.render()
            } else if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current)
            }
            
            animationIdRef.current = requestAnimationFrame(animate)
        }

        const handleResize = () => {
            if (!containerRef.current || !cameraRef.current || !rendererRef.current) return
            
            const width = containerRef.current.offsetWidth
            const height = containerRef.current.offsetHeight
            
            cameraRef.current.aspect = width / height
            cameraRef.current.updateProjectionMatrix()
            rendererRef.current.setSize(width, height)
            
            if (composerRef.current) {
                composerRef.current.setSize(width, height)
            }
        }

        window.addEventListener('resize', handleResize)
        animate()

        return () => {
            window.removeEventListener('resize', handleResize)
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current)
            }
            if (rendererRef.current && containerRef.current) {
                containerRef.current.removeChild(rendererRef.current.domElement)
            }
            
            // Cleanup
            meshesRef.current = []
            spiralMeshesRef.current = []
            particleMeshesRef.current = []
            materialsRef.current.forEach(mat => mat.dispose())
            materialsRef.current = []
            portalMaterialsRef.current = []
            portalLightsRef.current = []
            
            if (rendererRef.current) {
                rendererRef.current.dispose()
            }
        }
    }, [createPortalCore, createVortexRings, createDimensionalStreams, createEnergyParticles, params])

    // GSAPアニメーション
    useEffect(() => {
        const section = sectionRef.current
        const title = titleRef.current
        const description = descriptionRef.current
        const service1Card = service1CardRef.current
        const service2Card = service2CardRef.current
        const service3Card = service3CardRef.current

        if (!section || !title || !description || !service1Card || !service2Card || !service3Card || !cameraRef.current) return

        // 初期状態設定
        gsap.set([title, description, service1Card, service2Card, service3Card], { opacity: 0 })
        gsap.set(title, { opacity: 1 }) // タイトルは最初に表示

        // カメラのlookAt用のダミーオブジェクト
        const cameraTarget = { x: 0, y: 0, z: 0 }

        // タイムラインを使って3段階のシンプルなアニメーション
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: section,
                start: "top top",
                end: "+=300%",
                scrub: 1,
                pin: true,
            }
        })

        // 30%: タイトルを消して説明文を表示し、カメラを左に向ける
        tl.to(title, {
            opacity: 0,
            duration: 0.2,
            ease: "power2.out"
        }, 0.3)
        .to(description, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        }, 0.3)
        .to(cameraTarget, {
            x: -3,
            duration: 0.2,
            ease: "power2.out",
            onUpdate: () => {
                if (cameraRef.current) {
                    cameraRef.current.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
                }
            }
        }, 0.3)

        // 70%: サービスカードを順番に表示し、カメラを少し下に向ける、粒子の色を変化
        tl.to(service1Card, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        }, 0.7)
        .to(service2Card, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        }, 0.72) // 0.02秒遅れ
        .to(service3Card, {
            opacity: 1,
            duration: 0.2,
            ease: "power2.out"
        }, 0.74) // 0.04秒遅れ
        .to(cameraTarget, {
            y: -1,
            duration: 0.2,
            ease: "power2.out",
            onUpdate: () => {
                if (cameraRef.current) {
                    cameraRef.current.lookAt(cameraTarget.x, cameraTarget.y, cameraTarget.z)
                }
            }
        }, 0.7)
        .call(() => {
            // 粒子の色を白から青・紫に変化させる
            particleMeshesRef.current.forEach(particleObject => {
                const particles = particleObject as THREE.Points
                const geometry = particles.geometry as THREE.BufferGeometry
                const colors = geometry.attributes.color.array as Float32Array
                const finalColors = geometry.userData.finalColors as Float32Array
                
                if (finalColors) {
                    // GSAPで色をアニメーション
                    gsap.to(colors, {
                        duration: 1.0,
                        ease: "power2.out",
                        onUpdate: function() {
                            const progress = this.progress()
                            for (let i = 0; i < colors.length; i++) {
                                // 白色(1,1,1)から最終色へ補間
                                colors[i] = 1 + (finalColors[i] - 1) * progress
                            }
                            geometry.attributes.color.needsUpdate = true
                        }
                    })
                }
            })
        }, [], 0.7)

        return () => {
            ScrollTrigger.getAll().forEach(st => st.kill())
        }
    }, [])

    return (
        <section ref={sectionRef} className="relative h-screen bg-black overflow-hidden">
            {/* Three.js Canvas */}
            <div ref={containerRef} className="absolute inset-0" />

            {/* Loading overlay */}
            {isLoading && (
                <div className="fixed inset-0 bg-gradient-to-br from-black to-purple-900 flex justify-center items-center z-50">
                    <div className="w-32 h-32 border-8 border-transparent border-t-purple-500 border-b-blue-500 rounded-full animate-spin"></div>
                </div>
            )}

            {/* タイトル - 中央 */}
            <div 
                ref={titleRef}
                className="absolute inset-0 flex items-center justify-center text-white z-20"
            >
                <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    Our Service
                </h1>
            </div>

            {/* 説明文 - 右上 */}
            <div 
                ref={descriptionRef}
                className="absolute top-1/2 -translate-y-1/2 left-1/4 -translate-x-1/2 max-w-md text-white z-10 bg-blur-sm backdrop-blur-sm bg-opacity-50 p-4 rounded-lg"
            >
                <span className="text-sm text-gray-300 leading-relaxed mb-6">Core</span>
                <h2 className="text-3xl font-bold mb-4 pb-2  bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent border-b border-white">
                    AI Solution
                </h2>
                <p className="text-lg text-gray-300 leading-relaxed">
                    中核となるAI技術から、様々なソリューションが生まれます。
                    革新的なテクノロジーで、ビジネスの可能性を無限に広げます。
                </p>
            </div>

            {/* AI Analytics */}
            <div ref={service1CardRef} className="absolute bottom-20 left-1/4 -translate-x-1/2 text-white z-10 max-w-md  bg-blur-sm backdrop-blur-sm bg-opacity-50 p-4 rounded-lg">
                <span className="text-sm text-gray-300 leading-relaxed mb-6">Service 1</span>
                <h3 className="text-3xl font-bold mb-4 pb-2 text-white border-b border-white">
                    ARCHAIVE
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    データを価値に変える先進的な分析ソリューション。機械学習とAIで深い洞察を提供します。
                </p>
                <ViewMoreLink 
                    href="/services/ai-analytics" 
                    className="!text-white hover:!text-purple-400"
                />
            </div>

            {/* Cloud Solutions */}
            <div ref={service2CardRef} className="absolute bottom-20 left-1/2 -translate-x-1/2 text-white z-10 max-w-md  bg-blur-sm backdrop-blur-sm bg-opacity-50 p-4 rounded-lg">
                <span className="text-sm text-gray-300 leading-relaxed mb-6">Service 2</span>
                <h3 className="text-3xl font-bold mb-4 pb-2 text-white border-b border-white">
                    Send AI
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    スケーラブルで安全なクラウドインフラストラクチャ。最新のクラウド技術で効率化を実現。
                </p>
                <ViewMoreLink 
                    href="/services/cloud-solutions" 
                    className="!text-white hover:!text-blue-400"
                />
            </div>

            {/* Automation */}
            <div ref={service3CardRef} className="absolute bottom-20 left-3/4 -translate-x-1/2 text-white z-10 max-w-md  bg-blur-sm backdrop-blur-sm bg-opacity-50 p-4 rounded-lg">
                <span className="text-sm text-gray-300 leading-relaxed mb-6">Service 3</span>
                <h3 className="text-3xl font-bold mb-4 pb-2 text-white border-b border-white">
                    Othre Products
                </h3>
                <p className="text-lg text-gray-300 leading-relaxed mb-6">
                    業務プロセスを自動化し効率性を最大化。RPAとAIで業務革新を支援します。
                </p>
                <ViewMoreLink 
                    href="/services/automation" 
                    className="!text-white hover:!text-cyan-400"
                />
            </div>
        </section>
    )
}