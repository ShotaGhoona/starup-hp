'use client'

import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import * as THREE from 'three'

interface MovingBlackholeProps {
  className?: string
}

interface MovingBlackholeRef {
  triggerEffect: (x: number, y: number, intensity: number) => void
}

const MovingBlackhole = forwardRef<MovingBlackholeRef, MovingBlackholeProps>(({ className = '' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const starFieldRef = useRef<THREE.Points | null>(null)
  const starsMaterialRef = useRef<THREE.ShaderMaterial | null>(null)
  const planetRef = useRef<THREE.Mesh | null>(null)
  const timeRef = useRef(0)
  const clickRef = useRef({ x: 0, y: 0, intensity: 0, time: 0 })

  useImperativeHandle(ref, () => ({
    triggerEffect: (x: number, y: number, intensity: number) => {
      clickRef.current.x = x
      clickRef.current.y = y
      clickRef.current.intensity = intensity
      clickRef.current.time = timeRef.current
    }
  }))

  // Vertex shader with curl noise
  const vertexShader = `
    uniform float u_time;
    uniform vec2 u_click;
    uniform float u_intensity;
    uniform float u_click_time;

    vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }

    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float snoise(vec3 v)
      { 
      const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

    // First corner
      vec3 i  = floor(v + dot(v, C.yyy) );
      vec3 x0 =   v - i + dot(i, C.xxx) ;

    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );

      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;

    // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

    // Gradients: 7x7 points over a square, mapped onto an octahedron.
      float n_ = 0.142857142857;
      vec3  ns = n_ * D.wyz - D.xzx;

      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );

      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);

      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );

      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));

      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);

    //Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;

    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
      }

      vec3 snoiseVec3( vec3 x ){
        float s  = snoise(vec3( x ));
        float s1 = snoise(vec3( x.y - 19.1 , x.z + 33.4 , x.x + 47.2 ));
        float s2 = snoise(vec3( x.z + 74.2 , x.x - 124.5 , x.y + 99.4 ));
        vec3 c = vec3( s , s1 , s2 );
        return c;
      }

      vec3 curlNoise( vec3 p ){
        const float e = .1;
        vec3 dx = vec3( e   , 0.0 , 0.0 );
        vec3 dy = vec3( 0.0 , e   , 0.0 );
        vec3 dz = vec3( 0.0 , 0.0 , e   );

        vec3 p_x0 = snoiseVec3( p - dx );
        vec3 p_x1 = snoiseVec3( p + dx );
        vec3 p_y0 = snoiseVec3( p - dy );
        vec3 p_y1 = snoiseVec3( p + dy );
        vec3 p_z0 = snoiseVec3( p - dz );
        vec3 p_z1 = snoiseVec3( p + dz );

        float x = p_y1.z - p_y0.z - p_z1.y + p_z0.y;
        float y = p_z1.x - p_z0.x - p_x1.z + p_x0.z;
        float z = p_x1.y - p_x0.y - p_y1.x + p_y0.x;

        const float divisor = 1.0 / ( 2.0 * e );
        return normalize( vec3( x , y , z ) * divisor );
      }

    varying vec3 newPosition;

    void main() {
      gl_PointSize = 1.;
      
      vec3 pos = position;
      vec3 curl = curlNoise(pos + u_time / 5.);
      
      // Calculate distance from click point in 3D space
      vec3 worldPos = pos * 40.0;
      vec3 clickPos3D = vec3(u_click.x, u_click.y, 0.0);
      float dist = distance(worldPos, clickPos3D);
      
      // Create explosion/dispersal effect
      float timeSinceClick = u_time - u_click_time;
      float waveRadius = timeSinceClick * 80.0; // Faster wave speed
      float waveStrength = u_intensity * exp(-timeSinceClick * 1.5); // Slower decay
      
      // Multiple wave effects for more dynamic feel
      float wave1 = exp(-abs(dist - waveRadius) * 0.05);
      float wave2 = exp(-abs(dist - waveRadius * 0.7) * 0.08);
      float wave3 = exp(-abs(dist - waveRadius * 0.4) * 0.12);
      
      float combinedWave = (wave1 + wave2 * 0.6 + wave3 * 0.4) * waveStrength;
      
      // Direction away from click point (dispersal)
      vec3 dispersalDir = normalize(worldPos - clickPos3D);
      
      // Add randomness to dispersal direction
      vec3 randomOffset = curlNoise(worldPos * 0.1 + timeSinceClick);
      dispersalDir += randomOffset * 0.3;
      dispersalDir = normalize(dispersalDir);
      
      // Apply stronger dispersal force with distance falloff
      float distanceFactor = 1.0 / (1.0 + dist * 0.01);
      pos += dispersalDir * combinedWave * 0.8 * distanceFactor;
      
      // Apply curl noise with wave influence
      newPosition = pos * (40. + curl * (10. + combinedWave * 4.0));
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `

  // Fragment shader
  const fragmentShader = `
    varying vec3 newPosition;

    void main() {
      gl_FragColor = vec4(0.,0,0.,1);
    }
  `

  useEffect(() => {
    if (!containerRef.current) return

    let containerElement: HTMLElement | null = null

    const handleClick = (event: MouseEvent) => {
      if (!containerRef.current) return
      
      const rect = containerRef.current.getBoundingClientRect()
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1
      
      clickRef.current.x = x * 80
      clickRef.current.y = y * 80
      clickRef.current.intensity = 2.0
      clickRef.current.time = timeRef.current
    }

    const handleResize = () => {
      if (!cameraRef.current || !rendererRef.current) return

      const ww = window.innerWidth
      const wh = window.innerHeight

      cameraRef.current.aspect = ww / wh
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(ww, wh)
    }

    // Wait for page transition to complete
    const timer = setTimeout(() => {
      if (!containerRef.current) return

      const initScene = async () => {
      const ww = window.innerWidth
      const wh = window.innerHeight

      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, ww / wh, 0.1, 1000)
      camera.position.z = 100
      cameraRef.current = camera

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(ww, wh)
      renderer.setClearColor(0x000000, 0)
      rendererRef.current = renderer
      containerRef.current?.appendChild(renderer.domElement)


      // Create stars
      createStars()
    }

    const createStars = () => {
      if (!sceneRef.current) return

      const starsGeometry = new THREE.BufferGeometry()
      const positions = new Float32Array(100000 * 3)

      for (let i = 0; i < 100000; i++) {
        const i3 = i * 3
        const alpha = Math.random() * (Math.PI * 2)
        const theta = Math.random() * Math.PI

        positions[i3] = Math.cos(alpha) * Math.sin(theta)
        positions[i3 + 1] = Math.sin(alpha) * Math.sin(theta)
        positions[i3 + 2] = Math.cos(theta)
      }

      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

      const uniforms = {
        u_time: { value: 1.0 },
        u_click: { value: new THREE.Vector2(0, 0) },
        u_intensity: { value: 0.0 },
        u_click_time: { value: 0.0 }
      }

      const starsMaterial = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
      })

      starsMaterialRef.current = starsMaterial

      const starField = new THREE.Points(starsGeometry, starsMaterial)
      starFieldRef.current = starField
      sceneRef.current.add(starField)
    }


    const animate = () => {
      timeRef.current += 0.01

      if (starsMaterialRef.current) {
        starsMaterialRef.current.uniforms.u_time.value = timeRef.current
        starsMaterialRef.current.uniforms.u_click.value.x = clickRef.current.x
        starsMaterialRef.current.uniforms.u_click.value.y = clickRef.current.y
        starsMaterialRef.current.uniforms.u_intensity.value = clickRef.current.intensity
        starsMaterialRef.current.uniforms.u_click_time.value = clickRef.current.time
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      animationIdRef.current = requestAnimationFrame(animate)
    }

    initScene().then(() => {
      animate()
    })

    window.addEventListener('resize', handleResize)
    containerElement = containerRef.current
    if (containerElement) {
      containerElement.addEventListener('click', handleClick)
    }
    }, 200) // Wait longer than PageTransition delay

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      
      if (containerElement) {
        containerElement.removeEventListener('click', handleClick)
      }
      
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      
      if (rendererRef.current && containerRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement)
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef} 
      className={`w-full h-full overflow-hidden ${className}`}
    />
  )
})

MovingBlackhole.displayName = 'MovingBlackhole'

export default MovingBlackhole