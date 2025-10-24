"use client";

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const TechSection2: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const particleCanvasRef = useRef<HTMLCanvasElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);
  const speedValueRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Global variables
    let cardStreamController: any = null;
    let particleScanner: any = null;
    let particleSystem: any = null;

    // Initialize card stream
    const initCardStream = () => {
      const container = cardStreamRef.current;
      const cardLine = cardLineRef.current;
      const speedIndicator = speedValueRef.current;

      if (!container || !cardLine || !speedIndicator) return;

      const controller = {
        container,
        cardLine,
        speedIndicator,
        position: 0,
        velocity: 120,
        direction: -1,
        isAnimating: true,
        isDragging: false,
        lastTime: 0,
        lastMouseX: 0,
        mouseVelocity: 0,
        friction: 0.95,
        minVelocity: 30,
        containerWidth: 0,
        cardLineWidth: 0,

        init() {
          this.populateCardLine();
          this.calculateDimensions();
          this.setupEventListeners();
          this.updateCardPosition();
          this.animate();
          this.startPeriodicUpdates();
        },

        calculateDimensions() {
          this.containerWidth = this.container.offsetWidth;
          const cardWidth = 400;
          const cardGap = 60;
          const cardCount = this.cardLine.children.length;
          this.cardLineWidth = (cardWidth + cardGap) * cardCount;
        },

        setupEventListeners() {
          // Mouse events
          this.cardLine.addEventListener("mousedown", (e: MouseEvent) => this.startDrag(e));
          document.addEventListener("mousemove", (e: MouseEvent) => this.onDrag(e));
          document.addEventListener("mouseup", () => this.endDrag());

          // Touch events
          this.cardLine.addEventListener("touchstart", (e: TouchEvent) => this.startDrag(e.touches[0]), { passive: false });
          document.addEventListener("touchmove", (e: TouchEvent) => this.onDrag(e.touches[0]), { passive: false });
          document.addEventListener("touchend", () => this.endDrag());

          // Wheel and other events
          this.cardLine.addEventListener("wheel", (e: WheelEvent) => this.onWheel(e));
          this.cardLine.addEventListener("selectstart", (e: Event) => e.preventDefault());
          this.cardLine.addEventListener("dragstart", (e: Event) => e.preventDefault());

          window.addEventListener("resize", () => this.calculateDimensions());
        },

        startDrag(e: MouseEvent | Touch) {
          const event = e as MouseEvent;
          event.preventDefault?.();

          this.isDragging = true;
          this.isAnimating = false;
          this.lastMouseX = ('clientX' in e) ? e.clientX : (e as Touch).clientX;
          this.mouseVelocity = 0;

          const transform = window.getComputedStyle(this.cardLine).transform;
          if (transform !== "none") {
            const matrix = new DOMMatrix(transform);
            this.position = matrix.m41;
          }

          this.cardLine.style.animation = "none";
          this.cardLine.classList.add("dragging");

          document.body.style.userSelect = "none";
          document.body.style.cursor = "grabbing";
        },

        onDrag(e: MouseEvent | Touch) {
          if (!this.isDragging) return;
          const event = e as MouseEvent;
          event.preventDefault?.();

          const clientX = ('clientX' in e) ? e.clientX : (e as Touch).clientX;
          const deltaX = clientX - this.lastMouseX;
          this.position += deltaX;
          this.mouseVelocity = deltaX * 60;
          this.lastMouseX = clientX;

          this.cardLine.style.transform = `translateX(${this.position}px)`;
          this.updateCardClipping();
        },

        endDrag() {
          if (!this.isDragging) return;

          this.isDragging = false;
          this.cardLine.classList.remove("dragging");

          if (Math.abs(this.mouseVelocity) > this.minVelocity) {
            this.velocity = Math.abs(this.mouseVelocity);
            this.direction = this.mouseVelocity > 0 ? 1 : -1;
          } else {
            this.velocity = 120;
          }

          this.isAnimating = true;
          this.updateSpeedIndicator();

          document.body.style.userSelect = "";
          document.body.style.cursor = "";
        },

        onWheel(e: WheelEvent) {
          e.preventDefault();
          const scrollSpeed = 20;
          const delta = e.deltaY > 0 ? scrollSpeed : -scrollSpeed;

          this.position += delta;
          this.updateCardPosition();
          this.updateCardClipping();
        },

        animate() {
          const currentTime = performance.now();
          const deltaTime = (currentTime - this.lastTime) / 1000;
          this.lastTime = currentTime;

          if (this.isAnimating && !this.isDragging) {
            if (this.velocity > this.minVelocity) {
              this.velocity *= this.friction;
            } else {
              this.velocity = Math.max(this.minVelocity, this.velocity);
            }

            this.position += this.velocity * this.direction * deltaTime;
            this.updateCardPosition();
            this.updateSpeedIndicator();
          }

          requestAnimationFrame(() => this.animate());
        },

        updateCardPosition() {
          const containerWidth = this.containerWidth;
          const cardLineWidth = this.cardLineWidth;

          if (this.position < -cardLineWidth) {
            this.position = containerWidth;
          } else if (this.position > containerWidth) {
            this.position = -cardLineWidth;
          }

          this.cardLine.style.transform = `translateX(${this.position}px)`;
          this.updateCardClipping();
        },

        updateSpeedIndicator() {
          if (this.speedIndicator) {
            this.speedIndicator.textContent = Math.round(this.velocity).toString();
          }
        },

        generateCode(width: number, height: number): string {
          const library = [
            "// compiled preview • scanner demo",
            "/* generated for visual effect – not executed */",
            "const SCAN_WIDTH = 8;",
            "const FADE_ZONE = 35;",
            "const MAX_PARTICLES = 2500;",
            "const TRANSITION = 0.05;",
            "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
            "function lerp(a, b, t) { return a + (b - a) * t; }",
            "const now = () => performance.now();",
            "function rng(min, max) { return Math.random() * (max - min) + min; }",
            "class Particle {",
            "  constructor(x, y, vx, vy, r, a) {",
            "    this.x = x; this.y = y;",
            "    this.vx = vx; this.vy = vy;",
            "    this.r = r; this.a = a;",
            "  }",
            "  step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; }",
            "}",
            "const scanner = {",
            "  x: Math.floor(window.innerWidth / 2),",
            "  width: SCAN_WIDTH,",
            "  glow: 3.5,",
            "};",
            "function drawParticle(ctx, p) {",
            "  ctx.globalAlpha = clamp(p.a, 0, 1);",
            "  ctx.drawImage(gradient, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);",
            "}",
            "function tick(t) {",
            "  const dt = 0.016;",
            "  // update & render",
            "}",
            "const state = { intensity: 1.2, particles: MAX_PARTICLES };",
            "const bounds = { w: window.innerWidth, h: 300 };",
            "const gradient = document.createElement('canvas');",
            "const ctx = gradient.getContext('2d');",
            "ctx.globalCompositeOperation = 'lighter';",
          ];

          let flow = library.join(" ");
          flow = flow.replace(/\s+/g, " ").trim();
          const totalChars = width * height;
          
          while (flow.length < totalChars + width) {
            const extra = library[Math.floor(Math.random() * library.length)];
            flow += " " + extra.replace(/\s+/g, " ").trim();
          }

          let out = "";
          let offset = 0;
          for (let row = 0; row < height; row++) {
            let line = flow.slice(offset, offset + width);
            if (line.length < width) line = line + " ".repeat(width - line.length);
            out += line + (row < height - 1 ? "\n" : "");
            offset += width;
          }
          return out;
        },

        calculateCodeDimensions(cardWidth: number, cardHeight: number) {
          const fontSize = 11;
          const lineHeight = 13;
          const charWidth = 6;
          const width = Math.floor(cardWidth / charWidth);
          const height = Math.floor(cardHeight / lineHeight);
          return { width, height, fontSize, lineHeight };
        },

        createCardWrapper(index: number): HTMLDivElement {
          const wrapper = document.createElement("div");
          wrapper.className = "card-wrapper";

          const normalCard = document.createElement("div");
          normalCard.className = "card card-normal";

          const cardImages = [
            "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
            "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
            "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
            "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
            "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
          ];

          const cardImage = document.createElement("img");
          cardImage.className = "card-image";
          cardImage.src = cardImages[index % cardImages.length];
          cardImage.alt = "Credit Card";

          cardImage.onerror = () => {
            const canvas = document.createElement("canvas");
            canvas.width = 400;
            canvas.height = 250;
            const ctx = canvas.getContext("2d");

            if (ctx) {
              const gradient = ctx.createLinearGradient(0, 0, 400, 250);
              gradient.addColorStop(0, "#667eea");
              gradient.addColorStop(1, "#764ba2");

              ctx.fillStyle = gradient;
              ctx.fillRect(0, 0, 400, 250);

              cardImage.src = canvas.toDataURL();
            }
          };

          normalCard.appendChild(cardImage);

          const asciiCard = document.createElement("div");
          asciiCard.className = "card card-ascii";

          const asciiContent = document.createElement("div");
          asciiContent.className = "ascii-content";
          asciiContent.style.color = "#ffffff"; // Force white color

          const { width, height, fontSize, lineHeight } = this.calculateCodeDimensions(400, 250);
          asciiContent.style.fontSize = fontSize + "px";
          asciiContent.style.lineHeight = lineHeight + "px";
          asciiContent.textContent = this.generateCode(width, height);

          asciiCard.appendChild(asciiContent);
          wrapper.appendChild(normalCard);
          wrapper.appendChild(asciiCard);

          return wrapper;
        },

        updateCardClipping() {
          const scannerX = window.innerWidth / 2;
          const scannerWidth = 8;
          const scannerLeft = scannerX - scannerWidth / 2;
          const scannerRight = scannerX + scannerWidth / 2;
          let anyScanningActive = false;

          document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
            const rect = wrapper.getBoundingClientRect();
            const cardLeft = rect.left;
            const cardRight = rect.right;
            const cardWidth = rect.width;

            const normalCard = wrapper.querySelector(".card-normal") as HTMLElement;
            const asciiCard = wrapper.querySelector(".card-ascii") as HTMLElement;

            if (!normalCard || !asciiCard) return;

            if (cardLeft < scannerRight && cardRight > scannerLeft) {
              anyScanningActive = true;
              const scannerIntersectLeft = Math.max(scannerLeft - cardLeft, 0);
              const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth);

              const normalClipRight = (scannerIntersectLeft / cardWidth) * 100;
              const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100;

              normalCard.style.setProperty("--clip-right", `${normalClipRight}%`);
              asciiCard.style.setProperty("--clip-left", `${asciiClipLeft}%`);

              if (!wrapper.hasAttribute("data-scanned") && scannerIntersectLeft > 0) {
                wrapper.setAttribute("data-scanned", "true");
              }
            } else {
              if (cardRight < scannerLeft) {
                normalCard.style.setProperty("--clip-right", "100%");
                asciiCard.style.setProperty("--clip-left", "100%");
              } else if (cardLeft > scannerRight) {
                normalCard.style.setProperty("--clip-right", "0%");
                asciiCard.style.setProperty("--clip-left", "0%");
              }
              wrapper.removeAttribute("data-scanned");
            }
          });

          if ((window as any).setScannerScanning) {
            (window as any).setScannerScanning(anyScanningActive);
          }
        },

        updateAsciiContent() {
          document.querySelectorAll(".ascii-content").forEach((content) => {
            if (Math.random() < 0.15) {
              const { width, height } = this.calculateCodeDimensions(400, 250);
              content.textContent = this.generateCode(width, height);
            }
          });
        },

        populateCardLine() {
          this.cardLine.innerHTML = "";
          const cardsCount = 30;
          for (let i = 0; i < cardsCount; i++) {
            const cardWrapper = this.createCardWrapper(i);
            this.cardLine.appendChild(cardWrapper);
          }
        },

        startPeriodicUpdates() {
          setInterval(() => {
            this.updateAsciiContent();
          }, 200);

          const updateClipping = () => {
            this.updateCardClipping();
            requestAnimationFrame(updateClipping);
          };
          updateClipping();
        },

        toggleAnimation() {
          this.isAnimating = !this.isAnimating;
        },

        resetPosition() {
          this.position = this.containerWidth;
          this.velocity = 120;
          this.direction = -1;
          this.updateCardPosition();
          this.updateSpeedIndicator();
        },

        changeDirection() {
          this.direction *= -1;
        },
      };

      controller.init();
      cardStreamController = controller;

      // Global functions
      (window as any).toggleAnimation = () => controller.toggleAnimation();
      (window as any).resetPosition = () => controller.resetPosition();
      (window as any).changeDirection = () => controller.changeDirection();
    };

    // Initialize particle scanner
    const initParticleScanner = () => {
      const canvas = scannerCanvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const w = window.innerWidth;
      const h = 300;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";

      let scanningActive = false;
      let intensity = 0.8;
      let fadeZone = 60;
      const lightBarX = w / 2;
      const lightBarWidth = 8;

      const maxParticles = 2500;
      let count = 0;
      const particles: any = {};

      // Create gradient for particles
      const gradientCanvas = document.createElement("canvas");
      const gradientSize = 64;
      gradientCanvas.width = gradientSize;
      gradientCanvas.height = gradientSize;
      const gctx = gradientCanvas.getContext("2d");
      
      if (gctx) {
        const gradient = gctx.createRadialGradient(
          gradientSize / 2, gradientSize / 2, 0,
          gradientSize / 2, gradientSize / 2, gradientSize / 2
        );
        gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
        gradient.addColorStop(0.5, "rgba(255, 255, 255, 0.5)");
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
        gctx.fillStyle = gradient;
        gctx.fillRect(0, 0, gradientSize, gradientSize);
      }

      const createParticle = () => {
        const particle = {
          id: count,
          x: Math.random() * w,
          y: Math.random() * h,
          vx: Math.random() * 0.8 + 0.2,
          vy: (Math.random() - 0.5) * 0.3,
          radius: Math.random() * 1.5 + 0.5,
          alpha: Math.random() * 0.4 + 0.6,
          originalAlpha: 0,
          life: 1.0,
          time: 0,
          startX: 0,
        };
        return particle;
      };

      const updateParticle = (particle: any) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.time += 0.016;

        if (particle.x > w + particle.radius) {
          particle.x = -particle.radius;
          particle.y = Math.random() * h;
        }

        // Brightness near scanner
        const distToScanner = Math.abs(particle.x - lightBarX);
        const scannerInfluence = Math.max(0, 1 - distToScanner / 100);
        particle.alpha = particle.originalAlpha + scannerInfluence * (scanningActive ? 1.5 : 0.5);
      };

      const drawParticle = (particle: any) => {
        if (particle.life <= 0) return;

        let fadeAlpha = 1;

        if (particle.y < fadeZone) {
          fadeAlpha = particle.y / fadeZone;
        } else if (particle.y > h - fadeZone) {
          fadeAlpha = (h - particle.y) / fadeZone;
        }

        fadeAlpha = Math.max(0, Math.min(1, fadeAlpha));

        ctx.globalAlpha = particle.alpha * fadeAlpha;
        ctx.drawImage(
          gradientCanvas,
          particle.x - particle.radius,
          particle.y - particle.radius,
          particle.radius * 2,
          particle.radius * 2
        );
      };

      const drawLightBar = () => {
        const verticalGradient = ctx.createLinearGradient(0, 0, 0, h);
        verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        verticalGradient.addColorStop(fadeZone / h, "rgba(255, 255, 255, 1)");
        verticalGradient.addColorStop(1 - fadeZone / h, "rgba(255, 255, 255, 1)");
        verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.globalCompositeOperation = "lighter";

        const glowIntensity = scanningActive ? 3.5 : 1;
        const lineWidth = lightBarWidth;

        const coreGradient = ctx.createLinearGradient(
          lightBarX - lineWidth / 2, 0,
          lightBarX + lineWidth / 2, 0
        );
        coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)");
        coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`);
        coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.globalAlpha = 1;
        ctx.fillStyle = coreGradient;
        ctx.fillRect(lightBarX - lineWidth / 2, 0, lineWidth, h);

        const glow1Gradient = ctx.createLinearGradient(
          lightBarX - lineWidth * 2, 0,
          lightBarX + lineWidth * 2, 0
        );
        glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)");
        glow1Gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.8 * glowIntensity})`);
        glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)");

        ctx.globalAlpha = scanningActive ? 1.0 : 0.8;
        ctx.fillStyle = glow1Gradient;
        ctx.fillRect(lightBarX - lineWidth * 2, 0, lineWidth * 4, h);

        ctx.globalCompositeOperation = "destination-in";
        ctx.globalAlpha = 1;
        ctx.fillStyle = verticalGradient;
        ctx.fillRect(0, 0, w, h);
      };

      // Initialize particles
      for (let i = 0; i < maxParticles; i++) {
        const particle = createParticle();
        particle.originalAlpha = particle.alpha;
        particle.startX = particle.x;
        count++;
        particles[count] = particle;
      }

      const render = () => {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, w, h);

        drawLightBar();

        ctx.globalCompositeOperation = "lighter";
        for (let i = 1; i <= count; i++) {
          if (particles[i]) {
            updateParticle(particles[i]);
            drawParticle(particles[i]);
          }
        }

        requestAnimationFrame(render);
      };

      particleScanner = {
        setScanningActive: (active: boolean) => {
          scanningActive = active;
          intensity = active ? 1.8 : 0.8;
          fadeZone = active ? 35 : 60;
        }
      };

      (window as any).setScannerScanning = (active: boolean) => {
        if (particleScanner) {
          particleScanner.setScanningActive(active);
        }
      };

      render();

      window.addEventListener("resize", () => {
        const newW = window.innerWidth;
        canvas.width = newW;
        canvas.style.width = newW + "px";
      });
    };

    // Initialize Three.js particle system
    const initParticleSystem = async () => {
      if (!particleCanvasRef.current) return;

      try {
        const THREE = await import('three');

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(
          -window.innerWidth / 2,
          window.innerWidth / 2,
          125,
          -125,
          1,
          1000
        );
        camera.position.z = 100;

        const renderer = new THREE.WebGLRenderer({
          canvas: particleCanvasRef.current,
          alpha: true,
          antialias: true,
        });
        renderer.setSize(window.innerWidth, 250);
        renderer.setPixelRatio(window.devicePixelRatio);

        const particleCount = 400;
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        const alphas = new Float32Array(particleCount);
        const velocities = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
          positions[i * 3] = (Math.random() - 0.5) * window.innerWidth;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
          positions[i * 3 + 2] = 0;

          const color = new THREE.Color();
          color.setHSL(0.5 + Math.random() * 0.3, 0.8, 0.6);
          colors[i * 3] = color.r;
          colors[i * 3 + 1] = color.g;
          colors[i * 3 + 2] = color.b;

          alphas[i] = Math.random();
          velocities[i] = Math.random() * 50 + 20;
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

        const texture = new THREE.CanvasTexture(createParticleTexture());

        const material = new THREE.ShaderMaterial({
          uniforms: {
            pointTexture: { value: texture },
            size: { value: 15.0 },
          },
          vertexShader: `
            attribute float alpha;
            varying float vAlpha;
            varying vec3 vColor;
            uniform float size;
            
            void main() {
              vAlpha = alpha;
              vColor = color;
              vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
              gl_PointSize = size;
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            uniform sampler2D pointTexture;
            varying float vAlpha;
            varying vec3 vColor;
            
            void main() {
              gl_FragColor = vec4(vColor, vAlpha) * texture2D(pointTexture, gl_PointCoord);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          vertexColors: true,
        });

        const particles = new THREE.Points(geometry, material);
        scene.add(particles);

        particleSystem = {
          scene,
          camera,
          renderer,
          particles,
          velocities,
          alphas,
          particleCount,
        };

        const animateParticles = () => {
          if (particleSystem) {
            const { particles, velocities, particleCount } = particleSystem;
            const positions = particles.geometry.attributes.position.array;
            const alphaArray = particles.geometry.attributes.alpha.array;
            const time = Date.now() * 0.001;

            for (let i = 0; i < particleCount; i++) {
              positions[i * 3] += velocities[i] * 0.016;

              if (positions[i * 3] > window.innerWidth / 2 + 100) {
                positions[i * 3] = -window.innerWidth / 2 - 100;
                positions[i * 3 + 1] = (Math.random() - 0.5) * 250;
              }

              positions[i * 3 + 1] += Math.sin(time + i * 0.1) * 0.5;

              const twinkle = Math.floor(Math.random() * 10);
              if (twinkle === 1 && alphaArray[i] > 0) {
                alphaArray[i] -= 0.05;
              } else if (twinkle === 2 && alphaArray[i] < 1) {
                alphaArray[i] += 0.05;
              }

              alphaArray[i] = Math.max(0, Math.min(1, alphaArray[i]));
            }

            particles.geometry.attributes.position.needsUpdate = true;
            particles.geometry.attributes.alpha.needsUpdate = true;

            particleSystem.renderer.render(particleSystem.scene, particleSystem.camera);
          }

          requestAnimationFrame(animateParticles);
        };

        animateParticles();

        window.addEventListener("resize", () => {
          if (particleSystem) {
            const { camera, renderer } = particleSystem;
            camera.left = -window.innerWidth / 2;
            camera.right = window.innerWidth / 2;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, 250);
          }
        });
      } catch (error) {
        console.error('Failed to load Three.js:', error);
      }
    };

    // Helper function to create particle texture
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 64;
      canvas.height = 64;
      const context = canvas.getContext('2d')!;
      
      const gradient = context.createRadialGradient(32, 32, 0, 32, 32, 32);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.2, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.5, 'rgba(255,255,255,0.5)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      
      context.fillStyle = gradient;
      context.fillRect(0, 0, 64, 64);
      
      return canvas;
    };

    // Initialize everything
    const init = async () => {
      await initParticleSystem();
      initParticleScanner();
      initCardStream();
    };

    init();

    return () => {
      // Cleanup
      if (particleSystem && particleSystem.renderer) {
        particleSystem.renderer.dispose();
      }
    };
  }, []);

  const toggleAnimation = () => {
    if ((window as any).toggleAnimation) {
      (window as any).toggleAnimation();
    }
  };

  const resetPosition = () => {
    if ((window as any).resetPosition) {
      (window as any).resetPosition();
    }
  };

  const changeDirection = () => {
    if ((window as any).changeDirection) {
      (window as any).changeDirection();
    }
  };

  return (
    <div ref={containerRef} className="tech-section">
      <style jsx global>{`
        .tech-section {
          background: #000000;
          min-height: 100vh;
          overflow: hidden;
          font-family: "Arial", sans-serif;
          position: relative;
          color: #ffffff;
        }

        .tech-section * {
          color: inherit;
        }

        .controls {
          position: absolute;
          top: 20px;
          left: 20px;
          display: flex;
          gap: 10px;
          z-index: 100;
        }

        .control-btn {
          padding: 10px 20px;
          background: rgba(255, 255, 255, 0.2);
          border: none;
          border-radius: 25px;
          color: white;
          font-weight: bold;
          cursor: pointer;
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }

        .speed-indicator {
          position: absolute;
          top: 20px;
          right: 20px;
          color: white;
          font-size: 16px;
          background: rgba(0, 0, 0, 0.3);
          padding: 8px 16px;
          border-radius: 20px;
          backdrop-filter: blur(5px);
          z-index: 100;
        }

        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-stream {
          position: absolute;
          width: 100vw;
          height: 180px;
          display: flex;
          align-items: center;
          overflow: visible;
        }

        .card-line {
          display: flex;
          align-items: center;
          gap: 60px;
          white-space: nowrap;
          cursor: grab;
          user-select: none;
          will-change: transform;
        }

        .card-line:active {
          cursor: grabbing;
        }

        .card-line.dragging {
          cursor: grabbing;
        }

        .card-wrapper {
          position: relative;
          width: 400px;
          height: 250px;
          flex-shrink: 0;
        }

        .card {
          position: absolute;
          top: 0;
          left: 0;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-normal {
          background: transparent;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 0;
          color: white;
          z-index: 2;
          position: relative;
          overflow: hidden;
          clip-path: inset(0 0 0 var(--clip-right, 0%));
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 15px;
          transition: all 0.3s ease;
          filter: brightness(1.1) contrast(1.1);
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .card-ascii {
          background: transparent;
          z-index: 1;
          position: absolute;
          top: 0;
          left: 0;
          width: 400px;
          height: 250px;
          border-radius: 15px;
          overflow: hidden;
          clip-path: inset(0 calc(100% - var(--clip-left, 0%)) 0 0);
        }

        .ascii-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          font-family: 'Roboto Mono', 'Courier New', monospace;
          font-size: 11px;
          line-height: 13px;
          color: #ffffff !important;
          background: #0F172A;
          padding: 10px;
          overflow: hidden;
          white-space: pre;
          margin: 0;
        }

        .scanner {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 8px;
          height: 100%;
          background: transparent;
          z-index: 10;
          pointer-events: none;
        }

        #particleCanvas {
          position: absolute;
          top: calc(50% - 125px);
          left: 0;
          width: 100%;
          height: 250px;
          z-index: 5;
          pointer-events: none;
        }

        #scannerCanvas {
          position: absolute;
          top: calc(50% - 150px);
          left: 0;
          width: 100%;
          height: 300px;
          z-index: 15;
          pointer-events: none;
        }

        .inspiration-credit {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-family: "Roboto Mono", monospace;
          font-size: 12px;
          font-weight: 900;
          color: #ff9a9c;
          z-index: 1000;
          text-align: center;
        }

        .inspiration-credit a {
          color: #ff9a9c;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .inspiration-credit a:hover {
          color: #ff7a7c;
        }
      `}</style>

      <div className="controls">
        <button className="control-btn" onClick={toggleAnimation}>⏸️ Pause</button>
        <button className="control-btn" onClick={resetPosition}>🔄 Reset</button>
        <button className="control-btn" onClick={changeDirection}>↔️ Direction</button>
      </div>

      <div className="speed-indicator">
        Speed: <span ref={speedValueRef}>120</span> px/s
      </div>

      <div className="container">
        <canvas ref={particleCanvasRef} id="particleCanvas"></canvas>
        <canvas ref={scannerCanvasRef} id="scannerCanvas"></canvas>

        <div className="scanner"></div>

        <div className="card-stream" ref={cardStreamRef}>
          <div className="card-line" ref={cardLineRef}></div>
        </div>
      </div>

      <div className="inspiration-credit">
        Inspired by
        <a href="https://evervault.com/" target="_blank" rel="noopener noreferrer"> @evervault.com</a>
      </div>
    </div>
  );
};

export default TechSection2;