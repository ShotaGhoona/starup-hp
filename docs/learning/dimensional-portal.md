```html

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Cosmic Dimensional Portal</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; background: #000; font-family: 'Arial', sans-serif; }
    #portal-container { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; }
    .dg.ac { z-index: 1000 !important; }

    #loading-overlay {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(45deg, #000, #1a0033);
      display: flex; justify-content: center; align-items: center;
      z-index: 9999; transition: opacity 1s ease-out;
    }
    .loader {
      width: 150px; height: 150px; border: 44px solid transparent;
      border-radius: 50%; border-top-color: #9b59b6; border-bottom-color: #3498db;
      animation: spin 1.5s ease-in-out infinite;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    #info-panel {
      position: fixed; bottom: 20px; left: 20px;
      color: rgba(255, 255, 255, 0.8); font-size: 14px;
      pointer-events: none; text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
      z-index: 100; opacity: 0; transition: opacity 1s ease-in;
    }

    #control-panel {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: rgba(0, 0, 0, 0.7);
      padding: 15px;
      border-radius: 15px;
      border: 1px solid rgba(155, 89, 182, 0.3);
      backdrop-filter: blur(15px);
    }
    .control-row {
      display: flex;
      gap: 10px;
      justify-content: center;
    }
    .control-btn {
      background: rgba(155, 89, 182, 0.2);
      border: 1px solid rgba(155, 89, 182, 0.4);
      color: white;
      width: 50px;
      height: 50px;
      border-radius: 25px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
    }
    .control-btn:hover {
      background: rgba(155, 89, 182, 0.4);
      border-color: rgba(255, 255, 255, 0.8);
      transform: scale(1.1);
      box-shadow: 0 0 20px rgba(155, 89, 182, 0.6);
    }
    .control-btn:active {
      transform: scale(0.95);
    }
    .control-btn svg {
      width: 24px;
      height: 24px;
      z-index: 2;
    }

    #portal-btn {
      width: 100%;
      height: 60px;
      border-radius: 10px;
      background: linear-gradient(45deg, rgba(155, 89, 182, 0.3), rgba(52, 152, 219, 0.3));
      border-color: rgba(155, 89, 182, 0.6);
    }
    #portal-btn:hover {
      background: linear-gradient(45deg, rgba(155, 89, 182, 0.5), rgba(52, 152, 219, 0.5));
      box-shadow: 0 0 25px rgba(155, 89, 182, 0.7);
    }

    .btn-ripple {
      position: absolute; border-radius: 50%;
      background: rgba(255, 255, 255, 0.6);
      transform: scale(0); animation: ripple 0.6s linear;
      pointer-events: none;
    }
    @keyframes ripple {
      to { transform: scale(4); opacity: 0; }
    }

    #portal-indicator {
      position: fixed; top: 20px; left: 20px; z-index: 100;
      background: rgba(0, 0, 0, 0.8); border: 2px solid rgba(155, 89, 182, 0.5);
      border-radius: 10px; padding: 15px; backdrop-filter: blur(10px);
      color: rgba(255, 255, 255, 0.9); min-width: 200px;
      opacity: 0; transition: all 0.3s ease;
    }
    #portal-indicator.active {
      opacity: 1; border-color: rgba(52, 152, 219, 0.8);
      box-shadow: 0 0 20px rgba(52, 152, 219, 0.3);
    }
    .portal-bar {
      width: 100%; height: 8px; background: rgba(255, 255, 255, 0.2);
      border-radius: 4px; margin-top: 8px; overflow: hidden;
    }
    .portal-fill {
      height: 100%; background: linear-gradient(90deg, #9b59b6, #3498db);
      border-radius: 4px; transition: width 0.3s ease;
      box-shadow: 0 0 10px rgba(155, 89, 182, 0.5);
    }
  </style>
  <script type="importmap">
  {
    "imports": {
      "three": "https://cdn.jsdelivr.net/npm/three@0.166.0/build/three.module.js",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.166.0/examples/jsm/"
    }
  }
  </script>
</head>
<div id="loading-overlay">
  <div class="loader"></div>
</div>

<div id="portal-container"></div>

<div id="info-panel">
  <p><strong>Dimensional Portal</strong></p>
  <p>Mouse: Navigate | Double-click: Fullscreen</p>
</div>

<div id="portal-indicator">
  <div>Portal Stability</div>
  <div id="portal-status">Stabilizing</div>
  <div class="portal-bar">
    <div class="portal-fill" id="portal-fill" style="width: 100%"></div>
  </div>
</div>

<div id="control-panel">
  <button class="control-btn" id="portal-btn" title="Activate Portal">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="12" cy="12" r="3"></circle>
      <path d="M12 1v6m0 6v6"></path>
      <path d="m21 12-6-3 6-3"></path>
      <path d="m3 12 6 3-6 3"></path>
      <path d="m21 12-6 3 6 3"></path>
      <path d="m3 12 6-3-6-3"></path>
    </svg>
  </button>
  <div class="control-row">
    <button class="control-btn" id="reset-view" title="Reset Camera">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
        <path d="M21 3v5h-5"></path>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
        <path d="M3 21v-5h5"></path>
      </svg>
    </button>
    <button class="control-btn" id="randomize" title="Shift Dimensions">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 3a6.364 6.364 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        <path d="m7 14 3-3 3 3"></path>
        <path d="M2.5 17a24.12 24.12 0 0 0 2 2 24.12 24.12 0 0 0 2-2"></path>
        <path d="M22 12c0 6-4 6-6 0V9a4.5 4.5 0 0 0-4.5-4.5c-1.5 0-2.5 1.5-2.5 1.5s1-1.5 2.5-1.5A4.5 4.5 0 0 1 18 9v3Z"></path>
      </svg>
    </button>
  </div>
</div>

<script type="module">
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let portalEnergy = 100;
let portalCooldown = false;

function createRipple(button) {
  const ripple = document.createElement('span');
  ripple.classList.add('btn-ripple');
  button.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
}

class CosmicPortalVisualization {
  constructor() {
    this.params = {
      portalComplexity: 4,
      crystalCount: 12,
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
    };

    this.meshes = [];
    this.materials = [];
    this.portalMaterials = [];
    this.time = 0;
    
    this.init();
    this.createPortalScene();
    this.setupGUI();
    this.setupEventListeners();
    this.animate();
    
    setTimeout(() => {
      const overlay = document.getElementById('loading-overlay');
      overlay.style.opacity = '0';
      setTimeout(() => {
        overlay.style.display = 'none';
        document.getElementById('info-panel').style.opacity = '1';
        document.getElementById('portal-indicator').style.opacity = '1';
      }, 300);
    }, 100);
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0015);
    this.scene.fog = new THREE.FogExp2(0x1a0033, 0.001);

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 15);
    this.initialCameraPosition = this.camera.position.clone();

    this.scene.add(new THREE.AmbientLight(0x330066, 0.2));
    
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.6);
    mainLight.position.set(10, 10, 5);
    this.scene.add(mainLight);

    this.portalLights = [];
    const lightColors = [this.params.primaryColor, this.params.secondaryColor, this.params.accentColor, this.params.vortexColor];
    
    for (let i = 0; i < 6; i++) {
      const light = new THREE.PointLight(new THREE.Color(lightColors[i % 4]), 0.8, 20);
      this.scene.add(light);
      this.portalLights.push(light);
    }

    this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    document.getElementById('portal-container').appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 0.5;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 40;

    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    this.bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      this.params.bloomStrength, this.params.bloomRadius, this.params.bloomThreshold
    );
    this.composer.addPass(this.bloomPass);

    this.fxaaPass = new ShaderPass(FXAAShader);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio)
    );
    this.composer.addPass(this.fxaaPass);

    this.clock = new THREE.Clock();
  }

  createPortalScene() {
    this.meshes.forEach(m => this.scene.remove(m));
    this.materials.forEach(mat => mat?.dispose());
    this.meshes = [];
    this.materials = [];
    this.portalMaterials = [];

    this.createCosmicBackground();
    this.createPortalCore();
    this.createVortexRings();
    this.createFloatingCrystals();
    this.createDimensionalStreams();
    this.createPortalFrame();
    this.createEnergyParticles();
    this.createSpaceDistortion();
  }
  
  activatePortal() {
    if (portalCooldown || portalEnergy < 25) return;
    
    portalCooldown = true;
    portalEnergy = Math.max(0, portalEnergy - 25);
    this.updatePortalUI();
    
    this.portalMaterials.forEach(mat => {
      if(mat.uniforms && mat.uniforms.pulseTime) {
          mat.uniforms.pulseTime.value = this.time;
      }
    });
    
    setTimeout(() => { portalCooldown = false; }, 1000);
  }
  
  addPortalShader(material) {
      material.onBeforeCompile = (shader) => {
          shader.uniforms.time = { value: 0 };
          shader.uniforms.pulseTime = { value: -1000 };
          shader.uniforms.portalSpeed = { value: 8.0 };
          shader.uniforms.portalColor = { value: new THREE.Color(this.params.accentColor) };
          shader.uniforms.dimensionShift = { value: 0 };
          
          shader.vertexShader = `varying vec3 vWorldPosition;\n` + shader.vertexShader;
          
          shader.fragmentShader = `
              uniform float time;
              uniform float pulseTime;
              uniform float portalSpeed;
              uniform vec3 portalColor;
              uniform float dimensionShift;
              varying vec3 vWorldPosition;\n` + shader.fragmentShader;
          
          shader.vertexShader = shader.vertexShader.replace(
              '#include <begin_vertex>',
              `
              #include <begin_vertex>
              vWorldPosition = (modelMatrix * vec4(transformed, 1.0)).xyz;
              `
          );
          
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
          );
          this.portalMaterials.push(shader);
      };
  }

  createCosmicBackground() {
    const count = 4000;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 80 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      const temp = Math.random();
      const color = new THREE.Color();
      if (temp < 0.15) {
          color.setHSL(0.8, 0.8, 0.9);
      } else if (temp < 0.4) {
          color.setHSL(0.6, 0.6, 0.8);
      } else if (temp < 0.7) {
          color.setHSL(0.1, 0.3, 0.9);
      } else {
          color.setHSL(0.3, 0.7, 0.6);
      }
      color.toArray(colors, i3);
      sizes[i] = Math.random() * 0.5 + 0.1;
    }
    
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const mat = new THREE.PointsMaterial({
        size: 0.3, vertexColors: true, sizeAttenuation: true,
        blending: THREE.AdditiveBlending, depthWrite: false, transparent: true
    });
    
    const stars = new THREE.Points(geo, mat);
    this.scene.add(stars);
    this.meshes.push(stars);
    this.materials.push(mat);
  }

  createPortalCore() {
    const geo = new THREE.SphereGeometry(0.8, 32, 32);
    const mat = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pulseTime: { value: -1000 },
        dimensionShift: { value: 0 },
        color1: { value: new THREE.Color(this.params.primaryColor) },
        color2: { value: new THREE.Color(this.params.secondaryColor) },
        color3: { value: new THREE.Color(this.params.accentColor) }
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
    });
    this.portalMaterials.push(mat);
    const mesh = new THREE.Mesh(geo, mat);
    this.scene.add(mesh);
    this.meshes.push(mesh);
  }

  createVortexRings() {
    for (let ring = 0; ring < 5; ring++) {
      const radius = 2 + ring * 0.8;
      const geo = new THREE.TorusGeometry(radius, 0.05, 16, 64);
      const mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(this.getRingColor(ring)),
          transparent: true, opacity: 0.7, metalness: 0.8, roughness: 0.2,
          clearcoat: 0.8, clearcoatRoughness: 0.1,
          emissive: new THREE.Color(this.getRingColor(ring)).multiplyScalar(0.2)
      });
      this.addPortalShader(mat);
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = Math.PI * 0.1 * ring;
      mesh.rotation.z = Math.PI * 0.15 * ring;
      this.scene.add(mesh);
      this.meshes.push(mesh);
    }
  }

  createFloatingCrystals() {
    const crystalCount = this.params.crystalCount;
    for (let i = 0; i < crystalCount; i++) {
      const geo = new THREE.OctahedronGeometry(0.3 + Math.random() * 0.4, 1);
      const mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(this.getCrystalColor(i)),
          transparent: true, opacity: 0.8, metalness: 0.9, roughness: 0.1,
          clearcoat: 1.0, clearcoatRoughness: 0.0,
          emissive: new THREE.Color(this.getCrystalColor(i)).multiplyScalar(0.3)
      });
      this.addPortalShader(mat);
      
      const mesh = new THREE.Mesh(geo, mat);
      const angle = (i / crystalCount) * Math.PI * 2;
      const radius = 6 + Math.random() * 4;
      mesh.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 8,
        Math.sin(angle) * radius
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      this.scene.add(mesh);
      this.meshes.push(mesh);
    }
  }

  createDimensionalStreams() {
    const streamCount = 8;
    for (let i = 0; i < streamCount; i++) {
      const points = [];
      const segments = 120;
      
      for (let j = 0; j <= segments; j++) {
        const t = j / segments;
        const angle = t * Math.PI * 12 + i * Math.PI * 0.25;
        const radius = 3 + Math.sin(t * Math.PI * 6) * 1.5;
        const height = (t - 0.5) * 15;
        
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          height,
          Math.sin(angle) * radius
        ));
      }
      
      const curve = new THREE.CatmullRomCurve3(points);
      const geo = new THREE.TubeGeometry(curve, segments, 0.02, 8, false);
      const mat = new THREE.MeshPhysicalMaterial({
          color: new THREE.Color(this.getStreamColor(i)),
          transparent: true, opacity: 0.6, metalness: 1.0, roughness: 0.0,
          emissive: new THREE.Color(this.getStreamColor(i)).multiplyScalar(0.4)
      });
      this.addPortalShader(mat);
      
      const stream = new THREE.Mesh(geo, mat);
      this.scene.add(stream);
      this.meshes.push(stream);
    }
  }

  createPortalFrame() {
    const frameGeo = new THREE.TorusGeometry(7, 0.2, 16, 64);
    const frameMat = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(this.params.primaryColor),
        transparent: true, opacity: 0.4, metalness: 1.0, roughness: 0.1,
        clearcoat: 1.0, clearcoatRoughness: 0.0,
        emissive: new THREE.Color(this.params.primaryColor).multiplyScalar(0.5)
    });
    this.addPortalShader(frameMat);
    
    const frame = new THREE.Mesh(frameGeo, frameMat);
    this.scene.add(frame);
    this.meshes.push(frame);
  }

  createEnergyParticles() {
      const count = 1500;
      const geo = new THREE.BufferGeometry();
      const positions = new Float32Array(count * 3);
      const velocities = new Float32Array(count * 3);
      
      for (let i = 0; i < count; i++) {
          const r = 2 + Math.random() * 8;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          
          positions[i*3] = r * Math.sin(phi) * Math.cos(theta);
          positions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
          positions[i*3+2] = r * Math.cos(phi);
          
          velocities[i*3] = (Math.random() - 0.5) * 0.02;
          velocities[i*3+1] = (Math.random() - 0.5) * 0.02;
          velocities[i*3+2] = (Math.random() - 0.5) * 0.02;
      }
      
      geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geo.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));
      
      const mat = new THREE.PointsMaterial({
          size: 0.08, color: this.params.vortexColor,
          blending: THREE.AdditiveBlending, transparent: true, opacity: 0.8
      });
      
      const particles = new THREE.Points(geo, mat);
      this.scene.add(particles);
      this.meshes.push(particles);
      this.materials.push(mat);
  }

  createSpaceDistortion() {
      const geo = new THREE.SphereGeometry(12, 64, 64);
      const mat = new THREE.ShaderMaterial({
          uniforms: {
              time: { value: 0 },
              dimensionShift: { value: 0 },
              color1: { value: new THREE.Color(this.params.primaryColor) },
              color2: { value: new THREE.Color(this.params.vortexColor) }
          },
          vertexShader: `
              uniform float time;
              uniform float dimensionShift;
              varying vec3 vNorm;
              varying vec3 vPos;
              void main() {
                  vNorm = normal;
                  vPos = position;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
          `,
          fragmentShader: `
              uniform float time;
              uniform float dimensionShift;
              uniform vec3 color1;
              uniform vec3 color2;
              varying vec3 vNorm;
              varying vec3 vPos;
              void main() {
                  vec3 viewDir = normalize(cameraPosition - vPos);
                  float fresnel = pow(1.0 - abs(dot(vNorm, viewDir)), 4.0);
                  
                  float distortion = sin(vPos.x * 0.5 + time * 2.0) * cos(vPos.y * 0.7 + time * 1.5);
                  vec3 color = mix(color1, color2, distortion * 0.5 + 0.5 + dimensionShift * 0.3);
                  
                  gl_FragColor = vec4(color, fresnel * 0.3);
              }
          `,
          transparent: true, blending: THREE.AdditiveBlending, depthWrite: false
      });
      
      const distortion = new THREE.Mesh(geo, mat);
      this.scene.add(distortion);
      this.meshes.push(distortion);
      this.materials.push(mat);
  }

  getRingColor(ring) {
    const colors = [this.params.primaryColor, this.params.secondaryColor, this.params.accentColor, this.params.vortexColor];
    return colors[ring % colors.length];
  }

  getCrystalColor(index) {
    const colors = [this.params.accentColor, this.params.vortexColor, this.params.primaryColor, this.params.secondaryColor];
    return colors[index % colors.length];
  }

  getStreamColor(index) {
    const colors = [this.params.vortexColor, this.params.primaryColor, this.params.secondaryColor];
    return colors[index % colors.length];
  }

  updatePortalUI() {
    const indicator = document.getElementById('portal-indicator');
    const status = document.getElementById('portal-status');
    const fill = document.getElementById('portal-fill');
    if (!indicator || !status || !fill) return;
    
    fill.style.width = portalEnergy + '%';
    
    if (portalEnergy > 80) { 
      status.textContent = 'Stable'; 
      indicator.className = 'active'; 
    } else if (portalEnergy > 50) { 
      status.textContent = 'Fluctuating'; 
      indicator.className = 'active'; 
    } else if (portalEnergy > 25) { 
      status.textContent = 'Unstable'; 
      indicator.className = 'active'; 
    } else { 
      status.textContent = 'Collapsed'; 
      indicator.className = ''; 
    }
  }

  setupEventListeners() {
    document.getElementById('portal-btn').addEventListener('click', (e) => {
      createRipple(e.currentTarget); this.activatePortal();
    });
    document.getElementById('reset-view').addEventListener('click', (e) => {
      createRipple(e.currentTarget); this.controls.reset(); this.camera.position.copy(this.initialCameraPosition);
    });
    document.getElementById('randomize').addEventListener('click', (e) => {
      createRipple(e.currentTarget); this.shiftDimensions();
    });
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('dblclick', () => {
      if (!document.fullscreenElement) { document.documentElement.requestFullscreen(); }
      else { document.exitFullscreen(); }
    });
  }

  shiftDimensions() {
    const colors = ['#9b59b6', '#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#e67e22', '#1abc9c', '#34495e'];
    this.params.primaryColor = colors[Math.floor(Math.random() * colors.length)];
    this.params.secondaryColor = colors[Math.floor(Math.random() * colors.length)];
    this.params.accentColor = colors[Math.floor(Math.random() * colors.length)];
    this.params.vortexColor = colors[Math.floor(Math.random() * colors.length)];
    this.params.dimensionShift = Math.random();
    this.createPortalScene();
  }

  setupGUI() {
      const gui = new GUI();
      gui.add(this.params, 'portalComplexity', 1, 8, 1).onChange(() => this.createPortalScene());
      gui.add(this.params, 'crystalCount', 6, 20, 1).onChange(() => this.createPortalScene());
      gui.addColor(this.params, 'accentColor').name('Portal Energy').onChange(c => {
          this.portalMaterials.forEach(m => {
              if(m.uniforms && m.uniforms.portalColor) m.uniforms.portalColor.value.set(c);
          });
      });
      gui.add(this.params, 'bloomStrength', 0, 3, 0.1).onChange((v) => this.bloomPass.strength = v);
      gui.add(this.params, 'rotationSpeed', 0, 1, 0.1);
      gui.close();
  }

  animate() {
    requestAnimationFrame(() => this.animate());
    const delta = this.clock.getDelta();
    this.time = this.clock.getElapsedTime();
    
    if (portalEnergy < 100) {
      portalEnergy = Math.min(100, portalEnergy + delta * 8);
      this.updatePortalUI();
    }
    
    this.portalMaterials.forEach(shader => {
        if(shader.uniforms) {
            if(shader.uniforms.time) shader.uniforms.time.value = this.time;
            if(shader.uniforms.dimensionShift) shader.uniforms.dimensionShift.value = this.params.dimensionShift;
        }
    });
    
    this.materials.forEach(mat => {
        if(mat.uniforms) {
            if(mat.uniforms.time) mat.uniforms.time.value = this.time;
            if(mat.uniforms.dimensionShift) mat.uniforms.dimensionShift.value = this.params.dimensionShift;
        }
    });
    
    this.portalLights.forEach((light, i) => {
      const angle = this.time * 0.3 + (i / 6) * Math.PI * 2;
      const radius = 10 + Math.sin(this.time * 0.5 + i) * 3;
      light.position.x = Math.cos(angle) * radius;
      light.position.z = Math.sin(angle) * radius;
      light.position.y = Math.sin(this.time * 0.4 + i * 0.7) * 5;
    });
    
    this.meshes.forEach((mesh, i) => {
      if (!mesh.rotation) return;
      const speed = this.params.rotationSpeed;
      mesh.rotation.y += delta * speed * (i % 2 ? -1 : 1) * 0.3;
      mesh.rotation.x += delta * speed * 0.1;
      
      if (mesh.material && mesh.material.type === 'PointsMaterial') {
        const positions = mesh.geometry.attributes.position.array;
        for (let j = 0; j < positions.length; j += 3) {
          positions[j] += Math.sin(this.time + j) * 0.001;
          positions[j+1] += Math.cos(this.time + j) * 0.001;
          positions[j+2] += Math.sin(this.time * 0.7 + j) * 0.001;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
      }
    });
    
    this.controls.update();
    this.composer.render();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.composer.setSize(window.innerWidth, window.innerHeight);
    const pixelRatio = this.renderer.getPixelRatio();
    this.fxaaPass.material.uniforms['resolution'].value.set(
      1 / (window.innerWidth * pixelRatio), 1 / (window.innerHeight * pixelRatio)
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new CosmicPortalVisualization());
} else {
  new CosmicPortalVisualization();
}
</script>

```