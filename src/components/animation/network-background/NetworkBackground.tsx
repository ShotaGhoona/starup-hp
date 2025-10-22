'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

interface NetworkBackgroundProps {
  className?: string
}

// Color palettes - Cool colors (blues, cyans, teals)
const colorPalettes = [
  [new THREE.Color(0x0EA5E9), new THREE.Color(0x0284C7), new THREE.Color(0x0369A1), new THREE.Color(0x075985), new THREE.Color(0x38BDF8)],
  [new THREE.Color(0x06B6D4), new THREE.Color(0x0891B2), new THREE.Color(0x0E7490), new THREE.Color(0x155E75), new THREE.Color(0x22D3EE)],
  [new THREE.Color(0x14B8A6), new THREE.Color(0x0D9488), new THREE.Color(0x0F766E), new THREE.Color(0x134E4A), new THREE.Color(0x5EEAD4)],
  [new THREE.Color(0x3B82F6), new THREE.Color(0x2563EB), new THREE.Color(0x1D4ED8), new THREE.Color(0x1E40AF), new THREE.Color(0x60A5FA)]
]

interface Config {
  paused: boolean
  activePaletteIndex: number
  currentFormation: number
  numFormations: number
  densityFactor: number
}

class Node {
  position: THREE.Vector3
  connections: Array<{ node: Node; strength: number }> = []
  level: number
  type: number
  size: number
  distanceFromRoot: number

  constructor(position: THREE.Vector3, level = 0, type = 0) {
    this.position = position
    this.level = level
    this.type = type
    this.size = type === 0 ? THREE.MathUtils.randFloat(0.7, 1.2) : THREE.MathUtils.randFloat(0.4, 0.9)
    this.distanceFromRoot = 0
  }

  addConnection(node: Node, strength = 1.0) {
    if (!this.isConnectedTo(node)) {
      this.connections.push({ node, strength })
      node.connections.push({ node: this, strength })
    }
  }

  isConnectedTo(node: Node): boolean {
    return this.connections.some(conn => conn.node === node)
  }
}

const noiseFunctions = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;i=mod289(i);
    vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m*=m;return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p,float time){
    float value=0.0;float amplitude=0.5;float frequency=1.0;int octaves=3;
    for(int i=0;i<octaves;i++){
        value+=amplitude*snoise(p*frequency+time*0.2*frequency);
        amplitude*=0.5;frequency*=2.0;
    }
    return value;
}`

const nodeShader = {
  vertexShader: `${noiseFunctions}
  attribute float nodeSize;
  attribute float nodeType;
  attribute vec3 nodeColor;
  attribute vec3 connectionIndices;
  attribute float distanceFromRoot;
  uniform float uTime;
  uniform vec3 uPulsePositions[3];
  uniform float uPulseTimes[3];
  uniform float uPulseSpeed;
  uniform float uBaseNodeSize;
  varying vec3 vColor;
  varying float vNodeType;
  varying vec3 vPosition;
  varying float vPulseIntensity;
  varying float vDistanceFromRoot;

  float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
      if (pulseTime < 0.0) return 0.0;
      float timeSinceClick = uTime - pulseTime;
      if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;

      float pulseRadius = timeSinceClick * uPulseSpeed;
      float distToClick = distance(worldPos, pulsePos);
      float pulseThickness = 2.0;
      float waveProximity = abs(distToClick - pulseRadius);

      return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
  }

  void main() {
      vNodeType = nodeType;
      vColor = nodeColor;
      vDistanceFromRoot = distanceFromRoot;

      vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      vPosition = worldPos;

      float totalPulseIntensity = 0.0;
      for (int i = 0; i < 3; i++) {
          totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
      }
      vPulseIntensity = min(totalPulseIntensity, 1.0);

      float timeScale = 0.5 + 0.5 * sin(uTime * 0.8 + distanceFromRoot * 0.2);
      float baseSize = nodeSize * (0.8 + 0.2 * timeScale);
      float pulseSize = baseSize * (1.0 + vPulseIntensity * 2.0);

      vec3 modifiedPosition = position;
      if (nodeType > 0.5) {
          float noise = fbm(position * 0.1, uTime * 0.1);
          modifiedPosition += normal * noise * 0.2;
      }

      vec4 mvPosition = modelViewMatrix * vec4(modifiedPosition, 1.0);
      gl_PointSize = pulseSize * uBaseNodeSize * (800.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
  }`,

  fragmentShader: `
  uniform float uTime;
  uniform vec3 uPulseColors[3];
  uniform int uActivePalette;
  varying vec3 vColor;
  varying float vNodeType;
  varying vec3 vPosition;
  varying float vPulseIntensity;
  varying float vDistanceFromRoot;

  void main() {
      vec2 center = 2.0 * gl_PointCoord - 1.0;
      float dist = length(center);
      if (dist > 1.0) discard;

      float glowStrength = 1.0 - smoothstep(0.0, 1.0, dist);
      glowStrength = pow(glowStrength, 1.4);

      vec3 baseColor = vColor * (0.8 + 0.2 * sin(uTime * 0.5 + vDistanceFromRoot * 0.3));
      vec3 finalColor = baseColor;

      if (vPulseIntensity > 0.0) {
          vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
          finalColor = mix(baseColor, pulseColor, vPulseIntensity);
          finalColor *= (1.0 + vPulseIntensity * 0.7);
      }

      float alpha = glowStrength * (0.9 - 0.5 * dist);

      float camDistance = length(vPosition - cameraPosition);
      float distanceFade = smoothstep(80.0, 10.0, camDistance);

      if (vNodeType > 0.5) {
          alpha *= 0.85;
      } else {
          finalColor *= 1.2;
      }

      gl_FragColor = vec4(finalColor, alpha * distanceFade);
  }`
}

const connectionShader = {
  vertexShader: `${noiseFunctions}
  attribute vec3 startPoint;
  attribute vec3 endPoint;
  attribute float connectionStrength;
  attribute float pathIndex;
  attribute vec3 connectionColor;
  uniform float uTime;
  uniform vec3 uPulsePositions[3];
  uniform float uPulseTimes[3];
  uniform float uPulseSpeed;
  varying vec3 vColor;
  varying float vConnectionStrength;
  varying float vPulseIntensity;
  varying float vPathPosition;

  float getPulseIntensity(vec3 worldPos, vec3 pulsePos, float pulseTime) {
      if (pulseTime < 0.0) return 0.0;
      float timeSinceClick = uTime - pulseTime;
      if (timeSinceClick < 0.0 || timeSinceClick > 3.0) return 0.0;
      float pulseRadius = timeSinceClick * uPulseSpeed;
      float distToClick = distance(worldPos, pulsePos);
      float pulseThickness = 2.0;
      float waveProximity = abs(distToClick - pulseRadius);
      return smoothstep(pulseThickness, 0.0, waveProximity) * smoothstep(3.0, 0.0, timeSinceClick);
  }

  void main() {
      float t = position.x;
      vPathPosition = t;

      vec3 midPoint = mix(startPoint, endPoint, 0.5);
      float pathOffset = sin(t * 3.14159) * 0.1;
      vec3 perpendicular = normalize(cross(normalize(endPoint - startPoint), vec3(0.0, 1.0, 0.0)));
      if (length(perpendicular) < 0.1) perpendicular = vec3(1.0, 0.0, 0.0);
      midPoint += perpendicular * pathOffset;

      vec3 p0 = mix(startPoint, midPoint, t);
      vec3 p1 = mix(midPoint, endPoint, t);
      vec3 finalPos = mix(p0, p1, t);

      float noiseTime = uTime * 0.2;
      float noise = fbm(vec3(pathIndex * 0.1, t * 0.5, noiseTime), noiseTime);
      finalPos += perpendicular * noise * 0.1;

      vec3 worldPos = (modelMatrix * vec4(finalPos, 1.0)).xyz;

      float totalPulseIntensity = 0.0;
      for (int i = 0; i < 3; i++) {
          totalPulseIntensity += getPulseIntensity(worldPos, uPulsePositions[i], uPulseTimes[i]);
      }
      vPulseIntensity = min(totalPulseIntensity, 1.0);

      vColor = connectionColor;
      vConnectionStrength = connectionStrength;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(finalPos, 1.0);
  }`,

  fragmentShader: `
  uniform float uTime;
  uniform vec3 uPulseColors[3];
  varying vec3 vColor;
  varying float vConnectionStrength;
  varying float vPulseIntensity;
  varying float vPathPosition;

  void main() {
      vec3 baseColor = vColor * (0.7 + 0.3 * sin(uTime * 0.5 + vPathPosition * 10.0));

      float flowPattern = sin(vPathPosition * 20.0 - uTime * 3.0) * 0.5 + 0.5;
      float flowIntensity = 0.3 * flowPattern * vConnectionStrength;

      vec3 finalColor = baseColor;

      if (vPulseIntensity > 0.0) {
          vec3 pulseColor = mix(vec3(1.0), uPulseColors[0], 0.3);
          finalColor = mix(baseColor, pulseColor, vPulseIntensity);
          flowIntensity += vPulseIntensity * 0.5;
      }

      finalColor *= (0.6 + flowIntensity + vConnectionStrength * 0.4);

      float alpha = 0.8 * vConnectionStrength + 0.2 * flowPattern;
      alpha = mix(alpha, min(1.0, alpha * 2.0), vPulseIntensity);

      gl_FragColor = vec4(finalColor, alpha);
  }`
}

export default function NetworkBackground({ className = '' }: NetworkBackgroundProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const clockRef = useRef<THREE.Clock>(new THREE.Clock())
  const nodesMeshRef = useRef<THREE.Points | null>(null)
  const connectionsMeshRef = useRef<THREE.LineSegments | null>(null)
  const neuralNetworkRef = useRef<{ nodes: Node[]; rootNode: Node } | null>(null)
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())
  const pointerRef = useRef<THREE.Vector2>(new THREE.Vector2())
  const lastPulseIndexRef = useRef<number>(0)
  const controlsRef = useRef<any>(null)
  const composerRef = useRef<any>(null)
  const starsSmallRef = useRef<THREE.Points | null>(null)
  const starsMediumRef = useRef<THREE.Points | null>(null)
  const starsLargeRef = useRef<THREE.Points | null>(null)

  const [config, setConfig] = useState<Config>({
    paused: false,
    activePaletteIndex: 0,
    currentFormation: 0,
    numFormations: 4,
    densityFactor: 1
  })

  const pulseUniforms = {
    uTime: { value: 0.0 },
    uPulsePositions: { value: [new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3), new THREE.Vector3(1e3, 1e3, 1e3)] },
    uPulseTimes: { value: [-1e3, -1e3, -1e3] },
    uPulseColors: { value: [new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1), new THREE.Color(1, 1, 1)] },
    uPulseSpeed: { value: 15.0 },
    uBaseNodeSize: { value: 0.5 },
    uActivePalette: { value: 0 }
  }

  const generateNeuralNetwork = useCallback((formationIndex: number, densityFactor = 1.0) => {
    let nodes: Node[] = []
    let rootNode: Node = new Node(new THREE.Vector3(0, 0, 0), 0, 0)

    function generateQuantumCortex() {
      rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0)
      rootNode.size = 1.5
      nodes.push(rootNode)
      
      const layers = 5
      const primaryAxes = 6
      const nodesPerAxis = 8
      const axisLength = 20
      const axisEndpoints: Node[] = []

      for (let a = 0; a < primaryAxes; a++) {
        const phi = Math.acos(-1 + (2 * a) / primaryAxes)
        const theta = Math.PI * (1 + Math.sqrt(5)) * a
        const dirVec = new THREE.Vector3(
          Math.sin(phi) * Math.cos(theta),
          Math.sin(phi) * Math.sin(theta),
          Math.cos(phi)
        )

        let prevNode = rootNode
        for (let i = 1; i <= nodesPerAxis; i++) {
          const t = i / nodesPerAxis
          const distance = axisLength * Math.pow(t, 0.8)
          const pos = new THREE.Vector3().copy(dirVec).multiplyScalar(distance)
          const nodeType = (i === nodesPerAxis) ? 1 : 0
          const newNode = new Node(pos, i, nodeType)
          newNode.distanceFromRoot = distance
          nodes.push(newNode)
          prevNode.addConnection(newNode, 1.0 - (t * 0.3))
          prevNode = newNode
          if (i === nodesPerAxis) axisEndpoints.push(newNode)
        }
      }

      const ringDistances = [5, 10, 15]
      const ringNodes: Node[][] = []
      for (const ringDist of ringDistances) {
        const nodesInRing = Math.floor(ringDist * 3 * densityFactor)
        const ringLayer: Node[] = []
        for (let i = 0; i < nodesInRing; i++) {
          const t = i / nodesInRing
          const ringPhi = Math.acos(2 * Math.random() - 1)
          const ringTheta = 2 * Math.PI * t
          const pos = new THREE.Vector3(
            ringDist * Math.sin(ringPhi) * Math.cos(ringTheta),
            ringDist * Math.sin(ringPhi) * Math.sin(ringTheta),
            ringDist * Math.cos(ringPhi)
          )
          const level = Math.ceil(ringDist / 5)
          const nodeType = Math.random() < 0.4 ? 1 : 0
          const newNode = new Node(pos, level, nodeType)
          newNode.distanceFromRoot = ringDist
          nodes.push(newNode)
          ringLayer.push(newNode)
        }
        ringNodes.push(ringLayer)

        for (let i = 0; i < ringLayer.length; i++) {
          const node = ringLayer[i]
          const nextNode = ringLayer[(i + 1) % ringLayer.length]
          node.addConnection(nextNode, 0.7)
          if (i % 4 === 0 && ringLayer.length > 5) {
            const jumpIdx = (i + Math.floor(ringLayer.length / 2)) % ringLayer.length
            node.addConnection(ringLayer[jumpIdx], 0.4)
          }
        }
      }

      for (const ring of ringNodes) {
        for (const node of ring) {
          let closestAxisNode = null
          let minDist = Infinity
          for (const n of nodes) {
            if (n === rootNode || n === node) continue
            if (n.level === 0 || n.type !== 0) continue
            const dist = node.position.distanceTo(n.position)
            if (dist < minDist) { 
              minDist = dist
              closestAxisNode = n
            }
          }
          if (closestAxisNode && minDist < 8) {
            const strength = 0.5 + (1 - minDist / 8) * 0.5
            node.addConnection(closestAxisNode, strength)
          }
        }
      }
    }

    function generateHyperdimensionalMesh() {
      rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0)
      rootNode.size = 1.5
      nodes.push(rootNode)
      
      const dimensions = 4
      const nodesPerDimension = Math.floor(40 * densityFactor)
      const maxRadius = 20

      const dimensionVectors = [
        new THREE.Vector3(1, 1, 1).normalize(),
        new THREE.Vector3(-1, 1, -1).normalize(),
        new THREE.Vector3(1, -1, -1).normalize(),
        new THREE.Vector3(-1, -1, 1).normalize()
      ]

      const dimensionNodes: Node[][] = []

      for (let d = 0; d < dimensions; d++) {
        const dimNodes: Node[] = []
        const dimVec = dimensionVectors[d]
        for (let i = 0; i < nodesPerDimension; i++) {
          const distance = maxRadius * Math.pow(Math.random(), 0.7)
          const randomVec = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloatSpread(1),
            THREE.MathUtils.randFloatSpread(1)
          ).normalize()
          const biasedVec = new THREE.Vector3().addVectors(
            dimVec.clone().multiplyScalar(0.6 + Math.random() * 0.4),
            randomVec.clone().multiplyScalar(0.3)
          ).normalize()

          const pos = biasedVec.clone().multiplyScalar(distance)
          const isLeaf = Math.random() < 0.4 || distance > maxRadius * 0.8
          const level = Math.floor(distance / (maxRadius / 4)) + 1
          const newNode = new Node(pos, level, isLeaf ? 1 : 0)
          newNode.distanceFromRoot = distance
          nodes.push(newNode)
          dimNodes.push(newNode)
          if (distance < maxRadius * 0.3) rootNode.addConnection(newNode, 0.7)
        }
        dimensionNodes.push(dimNodes)
      }
    }

    function generateNeuralVortex() {
      rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0)
      rootNode.size = 1.8
      nodes.push(rootNode)
      
      const numSpirals = 6
      const totalHeight = 30
      const maxRadius = 16
      const nodesPerSpiral = Math.floor(30 * densityFactor)
      const spiralNodes: Node[][] = []

      for (let s = 0; s < numSpirals; s++) {
        const spiralPhase = (s / numSpirals) * Math.PI * 2
        const spiralArray: Node[] = []
        for (let i = 0; i < nodesPerSpiral; i++) {
          const t = i / (nodesPerSpiral - 1)

          const height = (t - 0.5) * totalHeight
          const radiusCurve = Math.sin(t * Math.PI)
          const radius = maxRadius * radiusCurve

          const revolutions = 2.5
          const angle = spiralPhase + t * Math.PI * 2 * revolutions

          const pos = new THREE.Vector3(radius * Math.cos(angle), height, radius * Math.sin(angle))
          pos.add(new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(1.5),
            THREE.MathUtils.randFloatSpread(1.5),
            THREE.MathUtils.randFloatSpread(1.5)
          ))

          const level = Math.floor(t * 5) + 1
          const isLeaf = Math.random() < 0.3 || i > nodesPerSpiral - 3
          const newNode = new Node(pos, level, isLeaf ? 1 : 0)
          newNode.distanceFromRoot = Math.sqrt(radius * radius + height * height)
          nodes.push(newNode)
          spiralArray.push(newNode)
        }
        spiralNodes.push(spiralArray)
      }

      for (const spiral of spiralNodes) {
        rootNode.addConnection(spiral[0], 1.0)
        for (let i = 0; i < spiral.length - 1; i++) {
          spiral[i].addConnection(spiral[i + 1], 0.9)
        }
      }
    }

    function generateSynapticCloud() {
      rootNode = new Node(new THREE.Vector3(0, 0, 0), 0, 0)
      rootNode.size = 1.5
      nodes.push(rootNode)
      
      const numClusters = 6
      const maxDist = 18
      const clusterNodes: Node[] = []

      for (let c = 0; c < numClusters; c++) {
        const phi = Math.acos(2 * Math.random() - 1)
        const theta = 2 * Math.PI * Math.random()
        const distance = maxDist * (0.3 + 0.7 * Math.random())
        const pos = new THREE.Vector3(
          distance * Math.sin(phi) * Math.cos(theta),
          distance * Math.sin(phi) * Math.sin(theta),
          distance * Math.cos(phi)
        )
        const clusterNode = new Node(pos, 1, 0)
        clusterNode.size = 1.2
        clusterNode.distanceFromRoot = distance
        nodes.push(clusterNode)
        clusterNodes.push(clusterNode)
        rootNode.addConnection(clusterNode, 0.9)
      }

      for (const cluster of clusterNodes) {
        const clusterSize = Math.floor(20 * densityFactor)
        const cloudRadius = 7 + Math.random() * 3
        for (let i = 0; i < clusterSize; i++) {
          const radius = cloudRadius * Math.pow(Math.random(), 0.5)
          const dir = new THREE.Vector3(
            THREE.MathUtils.randFloatSpread(2),
            THREE.MathUtils.randFloatSpread(2),
            THREE.MathUtils.randFloatSpread(2)
          ).normalize()
          const pos = new THREE.Vector3().copy(cluster.position).add(dir.multiplyScalar(radius))

          const distanceFromCluster = radius
          const distanceFromRoot = rootNode.position.distanceTo(pos)
          const level = 2 + Math.floor(distanceFromCluster / 3)
          const isLeaf = Math.random() < 0.5
          const newNode = new Node(pos, level, isLeaf ? 1 : 0)
          newNode.distanceFromRoot = distanceFromRoot
          nodes.push(newNode)

          const strength = 0.7 * (1 - distanceFromCluster / cloudRadius)
          cluster.addConnection(newNode, strength)
        }
      }
    }

    switch (formationIndex % 4) {
      case 0: generateQuantumCortex(); break;
      case 1: generateHyperdimensionalMesh(); break;
      case 2: generateNeuralVortex(); break;
      case 3: generateSynapticCloud(); break;
    }

    if (densityFactor < 1.0) {
      const originalNodeCount = nodes.length
      nodes = nodes.filter((node, index) => {
        if (node === rootNode) return true
        const hash = (index * 31 + Math.floor(densityFactor * 100)) % 100
        return hash < (densityFactor * 100)
      })

      nodes.forEach(node => {
        node.connections = node.connections.filter(conn => nodes.includes(conn.node))
      })
    }

    return { nodes, rootNode }
  }, [])

  const createNetworkVisualization = useCallback((formationIndex: number, densityFactor = 1.0) => {
    if (!sceneRef.current) return

    // Cleanup existing meshes
    if (nodesMeshRef.current) {
      sceneRef.current.remove(nodesMeshRef.current)
      nodesMeshRef.current.geometry.dispose()
      if (Array.isArray(nodesMeshRef.current.material)) {
        nodesMeshRef.current.material.forEach(mat => mat.dispose())
      } else {
        nodesMeshRef.current.material.dispose()
      }
      nodesMeshRef.current = null
    }
    if (connectionsMeshRef.current) {
      sceneRef.current.remove(connectionsMeshRef.current)
      connectionsMeshRef.current.geometry.dispose()
      if (Array.isArray(connectionsMeshRef.current.material)) {
        connectionsMeshRef.current.material.forEach(mat => mat.dispose())
      } else {
        connectionsMeshRef.current.material.dispose()
      }
      connectionsMeshRef.current = null
    }

    neuralNetworkRef.current = generateNeuralNetwork(formationIndex, densityFactor)
    if (!neuralNetworkRef.current || neuralNetworkRef.current.nodes.length === 0) {
      console.error("Network generation failed or resulted in zero nodes.")
      return
    }

    const nodesGeometry = new THREE.BufferGeometry()
    const nodePositions: number[] = []
    const nodeTypes: number[] = []
    const nodeSizes: number[] = []
    const nodeColors: number[] = []
    const connectionIndices: number[] = []
    const distancesFromRoot: number[] = []

    neuralNetworkRef.current.nodes.forEach((node, index) => {
      nodePositions.push(node.position.x, node.position.y, node.position.z)
      nodeTypes.push(node.type)
      nodeSizes.push(node.size)
      distancesFromRoot.push(node.distanceFromRoot)

      const indices = node.connections.slice(0, 3).map(conn => neuralNetworkRef.current!.nodes.indexOf(conn.node))
      while (indices.length < 3) indices.push(-1)
      connectionIndices.push(...indices)

      const palette = colorPalettes[config.activePaletteIndex]
      const colorIndex = Math.min(node.level, palette.length - 1)
      const baseColor = palette[colorIndex % palette.length].clone()
      
      // Add some color variation
      const hsl = { h: 0, s: 0, l: 0 }
      baseColor.getHSL(hsl)
      baseColor.setHSL(
        hsl.h + THREE.MathUtils.randFloatSpread(0.05),
        Math.max(0, Math.min(1, hsl.s + THREE.MathUtils.randFloatSpread(0.1))),
        Math.max(0, Math.min(1, hsl.l + THREE.MathUtils.randFloatSpread(0.1)))
      )
      
      nodeColors.push(baseColor.r, baseColor.g, baseColor.b)
    })

    nodesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(nodePositions, 3))
    nodesGeometry.setAttribute('nodeType', new THREE.Float32BufferAttribute(nodeTypes, 1))
    nodesGeometry.setAttribute('nodeSize', new THREE.Float32BufferAttribute(nodeSizes, 1))
    nodesGeometry.setAttribute('nodeColor', new THREE.Float32BufferAttribute(nodeColors, 3))
    nodesGeometry.setAttribute('connectionIndices', new THREE.Float32BufferAttribute(connectionIndices, 3))
    nodesGeometry.setAttribute('distanceFromRoot', new THREE.Float32BufferAttribute(distancesFromRoot, 1))

    const nodesMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(pulseUniforms),
      vertexShader: nodeShader.vertexShader,
      fragmentShader: nodeShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    nodesMeshRef.current = new THREE.Points(nodesGeometry, nodesMaterial)
    sceneRef.current.add(nodesMeshRef.current)

    // Create connections
    const connectionsGeometry = new THREE.BufferGeometry()
    const connectionColors: number[] = []
    const connectionStrengths: number[] = []
    const connectionPositions: number[] = []
    const startPoints: number[] = []
    const endPoints: number[] = []
    const pathIndices: number[] = []
    const processedConnections = new Set<string>()
    let pathIndex = 0

    neuralNetworkRef.current.nodes.forEach((node, nodeIndex) => {
      node.connections.forEach(connection => {
        const connectedNode = connection.node
        const connectedIndex = neuralNetworkRef.current!.nodes.indexOf(connectedNode)
        if (connectedIndex === -1) return

        const key = [Math.min(nodeIndex, connectedIndex), Math.max(nodeIndex, connectedIndex)].join('-')
        if (!processedConnections.has(key)) {
          processedConnections.add(key)

          const startPoint = node.position
          const endPoint = connectedNode.position
          const numSegments = 15

          for (let i = 0; i < numSegments; i++) {
            const t = i / (numSegments - 1)
            connectionPositions.push(t, 0, 0)
            startPoints.push(startPoint.x, startPoint.y, startPoint.z)
            endPoints.push(endPoint.x, endPoint.y, endPoint.z)
            pathIndices.push(pathIndex)
            connectionStrengths.push(connection.strength)

            const palette = colorPalettes[config.activePaletteIndex]
            const avgLevel = Math.min(Math.floor((node.level + connectedNode.level) / 2), palette.length - 1)
            const baseColor = palette[avgLevel % palette.length].clone()
            
            // Add some color variation
            const hsl = { h: 0, s: 0, l: 0 }
            baseColor.getHSL(hsl)
            baseColor.setHSL(
              hsl.h + THREE.MathUtils.randFloatSpread(0.05),
              Math.max(0, Math.min(1, hsl.s + THREE.MathUtils.randFloatSpread(0.1))),
              Math.max(0, Math.min(1, hsl.l + THREE.MathUtils.randFloatSpread(0.1)))
            )
            
            connectionColors.push(baseColor.r, baseColor.g, baseColor.b)
          }
          pathIndex++
        }
      })
    })

    connectionsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(connectionPositions, 3))
    connectionsGeometry.setAttribute('startPoint', new THREE.Float32BufferAttribute(startPoints, 3))
    connectionsGeometry.setAttribute('endPoint', new THREE.Float32BufferAttribute(endPoints, 3))
    connectionsGeometry.setAttribute('connectionStrength', new THREE.Float32BufferAttribute(connectionStrengths, 1))
    connectionsGeometry.setAttribute('connectionColor', new THREE.Float32BufferAttribute(connectionColors, 3))
    connectionsGeometry.setAttribute('pathIndex', new THREE.Float32BufferAttribute(pathIndices, 1))

    const connectionsMaterial = new THREE.ShaderMaterial({
      uniforms: THREE.UniformsUtils.clone(pulseUniforms),
      vertexShader: connectionShader.vertexShader,
      fragmentShader: connectionShader.fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    })

    connectionsMeshRef.current = new THREE.LineSegments(connectionsGeometry, connectionsMaterial)
    sceneRef.current.add(connectionsMeshRef.current)

    const palette = colorPalettes[config.activePaletteIndex]
    connectionsMaterial.uniforms.uPulseColors.value[0].copy(palette[0])
    connectionsMaterial.uniforms.uPulseColors.value[1].copy(palette[1])
    connectionsMaterial.uniforms.uPulseColors.value[2].copy(palette[2])
    nodesMaterial.uniforms.uPulseColors.value[0].copy(palette[0])
    nodesMaterial.uniforms.uPulseColors.value[1].copy(palette[1])
    nodesMaterial.uniforms.uPulseColors.value[2].copy(palette[2])
    nodesMaterial.uniforms.uActivePalette.value = config.activePaletteIndex
  }, [config.activePaletteIndex, generateNeuralNetwork])

  const triggerPulse = useCallback((clientX: number, clientY: number) => {
    if (!mountRef.current || !cameraRef.current || !nodesMeshRef.current || !connectionsMeshRef.current) return

    pointerRef.current.x = (clientX / window.innerWidth) * 2 - 1
    pointerRef.current.y = -(clientY / window.innerHeight) * 2 + 1

    raycasterRef.current.setFromCamera(pointerRef.current, cameraRef.current)

    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const interactionPoint = new THREE.Vector3()

    interactionPlane.normal.copy(cameraRef.current.position).normalize()
    interactionPlane.constant = -interactionPlane.normal.dot(cameraRef.current.position) + cameraRef.current.position.length() * 0.5

    if (raycasterRef.current.ray.intersectPlane(interactionPlane, interactionPoint)) {
      const time = clockRef.current.getElapsedTime()

      lastPulseIndexRef.current = (lastPulseIndexRef.current + 1) % 3

      const nodesMaterial = nodesMeshRef.current.material as THREE.ShaderMaterial
      const connectionsMaterial = connectionsMeshRef.current.material as THREE.ShaderMaterial

      nodesMaterial.uniforms.uPulsePositions.value[lastPulseIndexRef.current].copy(interactionPoint)
      nodesMaterial.uniforms.uPulseTimes.value[lastPulseIndexRef.current] = time
      connectionsMaterial.uniforms.uPulsePositions.value[lastPulseIndexRef.current].copy(interactionPoint)
      connectionsMaterial.uniforms.uPulseTimes.value[lastPulseIndexRef.current] = time

      const palette = colorPalettes[config.activePaletteIndex]
      const randomColor = palette[Math.floor(Math.random() * palette.length)]
      nodesMaterial.uniforms.uPulseColors.value[lastPulseIndexRef.current].copy(randomColor)
      connectionsMaterial.uniforms.uPulseColors.value[lastPulseIndexRef.current].copy(randomColor)
    }
  }, [config.activePaletteIndex])

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x333333, 0.0015)
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(40, mountRef.current.offsetWidth / mountRef.current.offsetHeight, 0.1, 1200)
    camera.position.set(0, 5, 22)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" })
    renderer.setSize(mountRef.current.offsetWidth, mountRef.current.offsetHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x333333, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    rendererRef.current = renderer
    mountRef.current.appendChild(renderer.domElement)

    // Stars background - 3 layers (small / medium / large)
    const createStars = (count: number, size: number, spread: number, color = 0xffffff) => {
      const geometry = new THREE.BufferGeometry()
      const positions = new Float32Array(count * 3)
      for (let i = 0; i < count * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * spread
        positions[i + 1] = (Math.random() - 0.5) * spread
        positions[i + 2] = (Math.random() - 0.5) * spread
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      const material = new THREE.PointsMaterial({ color, size, sizeAttenuation: true })
      const points = new THREE.Points(geometry, material)
      scene.add(points)
      return points
    }

    // small, medium, large
    starsSmallRef.current = createStars(3500, 0.03, 220)
    starsMediumRef.current = createStars(2000, 0.08, 200)
    starsLargeRef.current = createStars(800, 0.18, 180)

    // Load OrbitControls - This will be async but should work
    import('three/examples/jsm/controls/OrbitControls.js').then(({ OrbitControls }) => {
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.rotateSpeed = 0.5
      controls.minDistance = 5
      controls.maxDistance = 100
      controls.autoRotate = true
      controls.autoRotateSpeed = 0.15
      controls.enablePan = false
      controls.enableZoom = false
      controlsRef.current = controls
    })


    // Load post-processing effects
    Promise.all([
      import('three/examples/jsm/postprocessing/EffectComposer.js'),
      import('three/examples/jsm/postprocessing/RenderPass.js'),
      import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
      import('three/examples/jsm/postprocessing/FilmPass.js'),
      import('three/examples/jsm/postprocessing/OutputPass.js')
    ]).then(([
      { EffectComposer },
      { RenderPass },
      { UnrealBloomPass },
      { FilmPass },
      { OutputPass }
    ]) => {
      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))

      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.68)
      composer.addPass(bloomPass)

      const filmPass = new FilmPass(0.35, false)
      composer.addPass(filmPass)

      composer.addPass(new OutputPass())
      composerRef.current = composer
    })

    createNetworkVisualization(config.currentFormation, config.densityFactor)

    const animate = () => {
      const t = clockRef.current.getElapsedTime()

      if (!config.paused) {
        if (starsSmallRef.current) {
          starsSmallRef.current.rotation.x += 0.0003
          starsSmallRef.current.rotation.y += 0.0003
        }
        if (starsMediumRef.current) {
          starsMediumRef.current.rotation.x += 0.0005
          starsMediumRef.current.rotation.y += 0.0005
        }
        if (starsLargeRef.current) {
          starsLargeRef.current.rotation.x += 0.0007
          starsLargeRef.current.rotation.y += 0.0007
        }
        if (nodesMeshRef.current) {
          const material = nodesMeshRef.current.material as THREE.ShaderMaterial
          material.uniforms.uTime.value = t
          nodesMeshRef.current.rotation.y = Math.sin(t * 0.05) * 0.08
        }
        if (connectionsMeshRef.current) {
          const material = connectionsMeshRef.current.material as THREE.ShaderMaterial
          material.uniforms.uTime.value = t
          connectionsMeshRef.current.rotation.y = Math.sin(t * 0.05) * 0.08
        }
      }


      if (controlsRef.current) {
        controlsRef.current.update()
      }

      if (composerRef.current) {
        composerRef.current.render()
      } else {
        renderer.render(scene, camera)
      }
      
      animationIdRef.current = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!mountRef.current) return
      
      const width = mountRef.current.offsetWidth
      const height = mountRef.current.offsetHeight
      
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      
      if (composerRef.current) {
        composerRef.current.setSize(width, height)
      }
    }

    const handleClick = (e: MouseEvent) => {
      if (!config.paused) triggerPulse(e.clientX, e.clientY)
    }

    const handleTouchStart = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length > 0 && !config.paused) {
        triggerPulse(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    window.addEventListener('resize', handleResize)
    renderer.domElement.addEventListener('click', handleClick)
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: false })
    animate()

    return () => {
      window.removeEventListener('resize', handleResize)
      renderer.domElement.removeEventListener('click', handleClick)
      renderer.domElement.removeEventListener('touchstart', handleTouchStart)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
      const disposePoints = (points: THREE.Points | null) => {
        if (!points) return
        const geo = points.geometry as THREE.BufferGeometry
        const mat = points.material as THREE.PointsMaterial
        geo.dispose()
        mat.dispose()
      }
      disposePoints(starsSmallRef.current)
      disposePoints(starsMediumRef.current)
      disposePoints(starsLargeRef.current)
      starsSmallRef.current = null
      starsMediumRef.current = null
      starsLargeRef.current = null
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [config, createNetworkVisualization, triggerPulse])

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full ${className}`}
      style={{ background: 'transparent' }}
    />
  )
}