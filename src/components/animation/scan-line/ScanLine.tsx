"use client";

import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ScanLine: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardStreamRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null);

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

      if (!container || !cardLine) return;

      const controller = {
        container,
        cardLine,
        speedIndicator: null,
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
          // Speed indicator removed
        },

        generateCode(width: number, height: number): string {
          const library = [
            "// Transform thought into technology",
            "/* Redesigning structures of industry and culture */",
            "const VISION = { power: Infinity, scope: 'universal' };",
            "const TRANSFORMATION_ENGINE = 'neural_synthesis';",
            "const CULTURAL_MATRIX = new Map();",
            "const INDUSTRY_PROTOCOLS = [];",
            "function transformThought(idea) { return technology.compile(idea); }",
            "function redesignStructure(legacy) { return innovation.rebuild(legacy); }",
            "const imagination = () => breakthrough.potential();",
            "function culturalShift(tradition, vision) { return synthesis(tradition, vision); }",
            "class ThoughtProcessor {",
            "  constructor(creativity, logic, intuition) {",
            "    this.creativity = creativity;",
            "    this.logic = logic;",
            "    this.intuition = intuition;",
            "  }",
            "  synthesize() { return this.creativity * this.logic * this.intuition; }",
            "}",
            "const paradigm = {",
            "  shift: () => evolution.next(),",
            "  break: () => revolution.begin(),",
            "  create: () => genesis.initialize(),",
            "};",
            "function innovate(concept, technology) {",
            "  return concept.transform().merge(technology).evolve();",
            "}",
            "const future = {",
            "  design: (vision) => architecture.build(vision),",
            "  implement: (idea) => reality.manifest(idea),",
            "}",
            "function bridgeWorlds(human, digital) {",
            "  return harmony.create(human.wisdom, digital.power);",
            "}",
            "const consciousness = { level: 'expanding', depth: 'infinite' };",
            "const technology = { purpose: 'human_flourishing' };",
            "function reimagine(system) { return system.deconstruct().rebuild(); }",
            "const synergy = (thought, tech) => thought.amplify(tech);",
            "// Where ideas become reality",
            "const transformation = { input: 'vision', output: 'revolution' };",
            "function cultivateChange() { return seeds.of.innovation.grow(); }",
            "const ecosystem = { thoughts: [], technologies: [], cultures: [] };",
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
            "/images/tech-cards/chuttersnap-kyCNGGKCvyw-unsplash.jpg",
            "/images/tech-cards/cosmin-georgian-gd3ysFyrsTQ-unsplash.jpg",
            "/images/tech-cards/homa-appliances-_XDK4naBbgw-unsplash.jpg",
            "/images/tech-cards/jezael-melgoza-layMbSJ3YOE-unsplash.jpg",
            "/images/tech-cards/josue-isai-ramos-figueroa-qvBYnMuNJ9A-unsplash.jpg",
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
          asciiContent.style.color = "#1a1a1a"; // Force dark color
          asciiContent.style.margin = "0";
          asciiContent.style.padding = "10px";

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
          const scannerX = Math.floor(window.innerWidth / 2); // Match lightBarX calculation
          const scannerWidth = 3; // Match the lightBarWidth
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
      const lightBarX = Math.floor(w / 2); // Ensure pixel-perfect alignment
      const lightBarWidth = 3;

      const maxParticles = 800;
      let count = 0;
      const particles: any = [];

      // Transition variables
      let currentIntensity = intensity;
      let currentMaxParticles = maxParticles;
      let currentFadeZone = fadeZone;
      const transitionSpeed = 0.05;

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
        gradient.addColorStop(0, "rgba(59, 130, 246, 1)");
        gradient.addColorStop(0.3, "rgba(96, 165, 250, 0.8)");
        gradient.addColorStop(0.7, "rgba(147, 197, 253, 0.4)");
        gradient.addColorStop(1, "rgba(186, 230, 253, 0)");
        gctx.fillStyle = gradient;
        gctx.fillRect(0, 0, gradientSize, gradientSize);
      }

      const createParticle = () => {
        const intensityRatio = intensity / 0.8;
        const speedMultiplier = 1 + (intensityRatio - 1) * 1.2;
        const sizeMultiplier = 1 + (intensityRatio - 1) * 0.7;

        const particle = {
          id: count,
          x: lightBarX + (Math.random() - 0.5) * lightBarWidth,
          y: Math.random() * h,
          vx: (Math.random() * 0.8 + 0.2) * speedMultiplier,
          vy: (Math.random() - 0.5) * 0.3 * speedMultiplier,
          radius: (Math.random() * 0.6 + 0.4) * sizeMultiplier,
          alpha: Math.random() * 0.4 + 0.6,
          decay: (Math.random() * 0.02 + 0.005) * (2 - intensityRatio * 0.5),
          originalAlpha: 0,
          life: 1.0,
          time: 0,
          startX: 0,
          twinkleSpeed: (Math.random() * 0.06 + 0.02) * speedMultiplier,
          twinkleAmount: Math.random() * 0.15 + 0.1,
        };
        return particle;
      };

      const updateParticle = (particle: any) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.time++;

        // Twinkle effect
        particle.alpha = particle.originalAlpha * particle.life + 
          Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount;

        particle.life -= particle.decay;

        // Reset particle if it goes off screen or dies
        if (particle.x > w + 10 || particle.life <= 0) {
          resetParticle(particle);
        }
      };

      const resetParticle = (particle: any) => {
        particle.x = lightBarX + (Math.random() - 0.5) * lightBarWidth;
        particle.y = Math.random() * h;
        particle.vx = Math.random() * 0.8 + 0.2;
        particle.vy = (Math.random() - 0.5) * 0.3;
        particle.alpha = Math.random() * 0.4 + 0.6;
        particle.originalAlpha = particle.alpha;
        particle.life = 1.0;
        particle.time = 0;
        particle.startX = particle.x;
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
        verticalGradient.addColorStop(0, "rgba(59, 130, 246, 0)");
        verticalGradient.addColorStop(fadeZone / h, "rgba(59, 130, 246, 1)");
        verticalGradient.addColorStop(1 - fadeZone / h, "rgba(59, 130, 246, 1)");
        verticalGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.globalCompositeOperation = "lighter";

        const glowIntensity = scanningActive ? 3.5 : 1;
        const lineWidth = lightBarWidth;

        const coreGradient = ctx.createLinearGradient(
          lightBarX - lineWidth / 2, 0,
          lightBarX + lineWidth / 2, 0
        );
        coreGradient.addColorStop(0, "rgba(59, 130, 246, 0)");
        coreGradient.addColorStop(0.3, `rgba(59, 130, 246, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(0.5, `rgba(37, 99, 235, ${1 * glowIntensity})`);
        coreGradient.addColorStop(0.7, `rgba(59, 130, 246, ${0.9 * glowIntensity})`);
        coreGradient.addColorStop(1, "rgba(59, 130, 246, 0)");

        ctx.globalAlpha = 1;
        ctx.fillStyle = coreGradient;
        ctx.fillRect(lightBarX - lineWidth / 2, 0, lineWidth, h);

        const glow1Gradient = ctx.createLinearGradient(
          lightBarX - lineWidth * 2, 0,
          lightBarX + lineWidth * 2, 0
        );
        glow1Gradient.addColorStop(0, "rgba(147, 197, 253, 0)");
        glow1Gradient.addColorStop(0.5, `rgba(96, 165, 250, ${0.8 * glowIntensity})`);
        glow1Gradient.addColorStop(1, "rgba(147, 197, 253, 0)");

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
        particles.push(particle);
        count++;
      }

      const render = () => {
        ctx.globalCompositeOperation = "source-over";
        ctx.clearRect(0, 0, w, h);

        drawLightBar();

        // Update transition values
        currentIntensity += (intensity - currentIntensity) * transitionSpeed;
        currentMaxParticles += (scanningActive ? 2500 : 800 - currentMaxParticles) * transitionSpeed;
        currentFadeZone += (fadeZone - currentFadeZone) * transitionSpeed;

        ctx.globalCompositeOperation = "lighter";
        
        // Update and draw particles
        particles.forEach((particle: any) => {
          if (particle) {
            updateParticle(particle);
            drawParticle(particle);
          }
        });

        // Add new particles based on intensity
        if (Math.random() < currentIntensity && particles.length < currentMaxParticles) {
          const particle = createParticle();
          particle.originalAlpha = particle.alpha;
          particle.startX = particle.x;
          particles.push(particle);
          count++;
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

    // Initialize Three.js particle system (removed - not needed)


    // Initialize everything
    const init = () => {
      initParticleScanner();
      initCardStream();
    };

    init();

    return () => {
      // Cleanup
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
          background: #f5f5f5;
          height: 400px;
          overflow: hidden;
          font-family: "Arial", sans-serif;
          position: relative;
          color: #333333;
        }

        .tech-section * {
          color: inherit;
        }


        .container {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-stream {
          position: absolute;
          width: 100%;
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
          border-radius: 0;
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
          border-radius: 0;
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
          border-radius: 0;
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
          color: #1a1a1a !important;
          background: transparent;
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


        #scannerCanvas {
          position: absolute;
          top: calc(50% - 150px);
          left: 0;
          width: 100%;
          height: 300px;
          z-index: 15;
          pointer-events: none;
        }

      `}</style>


      <div className="container">
        <canvas ref={scannerCanvasRef} id="scannerCanvas"></canvas>

        <div className="scanner"></div>

        <div className="card-stream" ref={cardStreamRef}>
          <div className="card-line" ref={cardLineRef}></div>
        </div>
      </div>

    </div>
  );
};

export default ScanLine;