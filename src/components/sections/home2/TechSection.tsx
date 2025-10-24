"use client";

import React, { useRef, useEffect } from 'react';

const TechSection: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = containerRef.current;
    const cardLine = cardLineRef.current;
    if (!container || !cardLine) return;

    // ASCII生成関数
    const generateASCII = (width: number, height: number) => {
      const library = [
        "const scanner = {",
        "  x: window.innerWidth / 2,",
        "  width: SCAN_WIDTH,",
        "  glow: 3.5,",
        "};",
        "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
        "function lerp(a, b, t) { return a + (b - a) * t; }",
        "const now = () => performance.now();",
        "class Particle {",
        "  constructor(x, y, vx, vy, r, a) {",
        "    this.x = x; this.y = y;",
        "    this.vx = vx; this.vy = vy;",
        "    this.r = r; this.a = a;",
        "  }",
        "  step(dt) { this.x += this.vx * dt; this.y += this.vy * dt; }",
        "}",
        "function tick(t) {",
        "  const dt = 0.016;",
        "  // update & render",
        "}",
        "const state = { intensity: 1.2, particles: MAX_PARTICLES };",
        "const gradient = document.createElement('canvas');",
        "ctx.globalCompositeOperation = 'lighter';",
      ];
      
      let flow = library.join(" ");
      const totalChars = width * height;
      while (flow.length < totalChars) {
        flow += " " + library[Math.floor(Math.random() * library.length)];
      }
      
      let result = "";
      for (let i = 0; i < height; i++) {
        result += flow.substr(i * width, width) + "\n";
      }
      return result;
    };

    // カード作成
    const createCard = (index: number) => {
      const wrapper = document.createElement("div");
      wrapper.className = "card-wrapper";
      wrapper.dataset.index = index.toString();

      // 通常のカード（画像）
      const normalCard = document.createElement("div");
      normalCard.className = "card card-normal";
      normalCard.style.background = `hsl(${index * 30}, 70%, 50%)`;
      
      const text = document.createElement("div");
      text.textContent = `Card ${index}`;
      text.style.fontSize = "24px";
      text.style.color = "white";
      text.style.textAlign = "center";
      text.style.marginTop = "100px";
      normalCard.appendChild(text);

      // ASCIIカード
      const asciiCard = document.createElement("div");
      asciiCard.className = "card card-ascii";
      
      const asciiContent = document.createElement("pre");
      asciiContent.className = "ascii-content";
      asciiContent.style.color = "#ffffff";
      asciiContent.style.margin = "0";
      asciiContent.textContent = `CARD ${index} - ASCII VERSION
================================
function transform() {
  return "ASCII_MODE";
}
================================
SCANNING COMPLETE
================================`; 
      asciiCard.appendChild(asciiContent);

      wrapper.appendChild(asciiCard);
      wrapper.appendChild(normalCard);
      return wrapper;
    };

    // 10枚のカードを作成（テスト用に少なく）
    for (let i = 0; i < 10; i++) {
      cardLine.appendChild(createCard(i));
    }

    // アニメーション
    let position = 0;
    const animate = () => {
      position -= 2;
      const totalWidth = cardLine.offsetWidth;
      
      // ループ処理
      if (position < -totalWidth / 2) {
        position = 0;
      }
      
      cardLine.style.transform = `translateX(${position}px)`;
      
      // スキャナー効果
      updateClipping();
      requestAnimationFrame(animate);
    };

    // クリッピング更新
    const updateClipping = () => {
      const scannerX = window.innerWidth / 2;
      const scannerWidth = 8; // 元の細いスキャナーに戻す

      document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
        const rect = wrapper.getBoundingClientRect();
        const normalCard = wrapper.querySelector(".card-normal") as HTMLElement;
        const asciiCard = wrapper.querySelector(".card-ascii") as HTMLElement;

        if (!normalCard || !asciiCard) return;

        const cardLeft = rect.left;
        const cardRight = rect.right;
        const cardWidth = rect.width;
        
        // カードとスキャナーの位置関係を計算
        if (cardRight > scannerX - scannerWidth/2 && cardLeft < scannerX + scannerWidth/2) {
          // スキャナー範囲内
          const progress = (scannerX - cardLeft) / cardWidth;
          const clampedProgress = Math.max(0, Math.min(1, progress));
          
          // 通常カードを左から隠す
          normalCard.style.clipPath = `inset(0 0 0 ${clampedProgress * 100}%)`;
          // ASCIIカードを左から表示
          asciiCard.style.clipPath = `inset(0 ${(1 - clampedProgress) * 100}% 0 0)`;
          
          // デバッグ
          const index = wrapper.dataset.index;
          if (index === "0" && clampedProgress > 0 && clampedProgress < 1) {
            console.log(`Card ${index}: progress=${clampedProgress.toFixed(2)}`);
          }
        } else if (cardRight < scannerX) {
          // 完全にスキャナーの左側 = 完全にASCII
          normalCard.style.clipPath = `inset(0 0 0 100%)`;
          asciiCard.style.clipPath = `inset(0 0 0 0)`;
        } else {
          // 完全にスキャナーの右側 = 完全に通常
          normalCard.style.clipPath = `inset(0 0 0 0)`;
          asciiCard.style.clipPath = `inset(0 100% 0 0)`;
        }
      });
    };

    animate();
  }, []);

  return (
    <div className="tech-section" ref={containerRef}>
      <style jsx global>{`
        .tech-section {
          background: #000;
          width: 100vw;
          height: 100vh;
          position: relative;
          overflow: hidden;
          color: #ffffff;
        }
        
        .tech-section * {
          color: inherit;
        }

        .container {
          position: relative;
          width: 100vw;
          height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .scanner {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 8px;
          height: 300px;
          background: linear-gradient(
            to bottom,
            transparent 0%,
            rgba(255, 255, 255, 0.5) 20%,
            rgba(255, 255, 255, 0.8) 50%,
            rgba(255, 255, 255, 0.5) 80%,
            transparent 100%
          );
          z-index: 5;
          pointer-events: none;
          box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          opacity: 0.5;
        }

        .card-stream {
          position: absolute;
          width: 100vw;
          height: 250px;
          display: flex;
          align-items: center;
          overflow: visible;
        }

        .card-line {
          display: flex;
          align-items: center;
          gap: 60px;
          white-space: nowrap;
          padding-left: 100vw;
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
          width: 100%;
          height: 100%;
          border-radius: 15px;
          overflow: hidden;
        }

        .card-normal {
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-ascii {
          background: #222;
          z-index: 2;
          border: 2px solid #fff;
        }

        .ascii-content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 15px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          line-height: 18px;
          color: #ffffff !important;
          overflow: hidden;
          margin: 0;
          background: #000;
          font-weight: normal;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-ascii pre {
          color: #ffffff !important;
        }
      `}</style>

      <div className="container">
        <div className="scanner"></div>
        <div className="card-stream">
          <div className="card-line" ref={cardLineRef}></div>
        </div>
      </div>
    </div>
  );
};

export default TechSection;