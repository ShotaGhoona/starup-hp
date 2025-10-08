'use client'

import { useRef, useEffect, useState } from 'react'

interface InteractiveBlackholeProps {
  className?: string
}

interface Star {
  orbital: number
  x: number
  y: number
  yOrigin: number
  speed: number
  rotation: number
  startRotation: number
  id: number
  collapseBonus: number
  color: string
  hoverPos: number
  expansePos: number
  prevR: number
  prevX: number
  prevY: number
  originalY: number
}

export default function InteractiveBlackhole({ className = '' }: InteractiveBlackholeProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationIdRef = useRef<number | null>(null)
  const starsRef = useRef<Star[]>([])
  const startTimeRef = useRef<number>(0)
  const collapseRef = useRef<boolean>(false)
  const expanseRef = useRef<boolean>(false)
  const returningRef = useRef<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return

    const container = containerRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    if (!context) return

    const h = container.offsetHeight
    const w = container.offsetWidth
    const cw = w
    const ch = h
    const maxorbit = 255
    const centery = ch / 2
    const centerx = cw / 2

    // Set canvas size
    canvas.width = cw
    canvas.height = ch

    // Set DPI
    const setDPI = (canvas: HTMLCanvasElement, dpi: number) => {
      if (!canvas.style.width)
        canvas.style.width = canvas.width + 'px'
      if (!canvas.style.height)
        canvas.style.height = canvas.height + 'px'

      const scaleFactor = dpi / 96
      canvas.width = Math.ceil(canvas.width * scaleFactor)
      canvas.height = Math.ceil(canvas.height * scaleFactor)
      const ctx = canvas.getContext('2d')
      if (ctx) {
        ctx.scale(scaleFactor, scaleFactor)
      }
    }

    const rotate = (cx: number, cy: number, x: number, y: number, angle: number): [number, number] => {
      const radians = angle
      const cos = Math.cos(radians)
      const sin = Math.sin(radians)
      const nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
      const ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
      return [nx, ny]
    }

    setDPI(canvas, 192)

    startTimeRef.current = new Date().getTime()
    starsRef.current = []

    // Create stars
    for (let i = 0; i < 2500; i++) {
      const rands = []
      rands.push(Math.random() * (maxorbit / 2) + 1)
      rands.push(Math.random() * (maxorbit / 2) + maxorbit)

      const orbital = (rands.reduce((p, c) => p + c, 0) / rands.length)
      
      const star: Star = {
        orbital,
        x: centerx,
        y: centery + orbital,
        yOrigin: centery + orbital,
        speed: (Math.floor(Math.random() * 2.5) + 1.5) * Math.PI / 180,
        rotation: 0,
        startRotation: (Math.floor(Math.random() * 360) + 1) * Math.PI / 180,
        id: i,
        collapseBonus: Math.max(0, orbital - (maxorbit * 0.7)),
        color: `rgba(0,0,0,${1 - ((orbital) / 255)})`,
        hoverPos: centery + (maxorbit / 2) + Math.max(0, orbital - (maxorbit * 0.7)),
        expansePos: centery + (i % 100) * -10 + (Math.floor(Math.random() * 20) + 1),
        prevR: (Math.floor(Math.random() * 360) + 1) * Math.PI / 180,
        prevX: centerx,
        prevY: centery + orbital,
        originalY: centery + orbital
      }

      starsRef.current.push(star)
    }

    const drawStar = (star: Star, currentTime: number) => {
      if (!expanseRef.current && !returningRef.current) {
        star.rotation = star.startRotation + (currentTime * star.speed)
        if (!collapseRef.current) {
          if (star.y > star.yOrigin) {
            star.y -= 2.5
          }
          if (star.y < star.yOrigin - 4) {
            star.y += (star.yOrigin - star.y) / 10
          }
        } else {
          if (star.y > star.hoverPos) {
            star.y -= (star.hoverPos - star.y) / -5
          }
          if (star.y < star.hoverPos - 4) {
            star.y += 2.5
          }
        }
      } else if (expanseRef.current && !returningRef.current) {
        star.rotation = star.startRotation + (currentTime * (star.speed / 2))
        if (star.y > star.expansePos) {
          star.y -= Math.floor(star.expansePos - star.y) / -80
        }
      } else if (returningRef.current) {
        star.rotation = star.startRotation + (currentTime * star.speed)
        if (Math.abs(star.y - star.originalY) > 2) {
          star.y += (star.originalY - star.y) / 50
        } else {
          star.y = star.originalY
          star.yOrigin = star.originalY
        }
      }

      context.save()
      context.fillStyle = star.color
      context.strokeStyle = star.color
      context.lineWidth = 1
      context.beginPath()
      const oldPos = rotate(centerx, centery, star.prevX, star.prevY, -star.prevR)
      context.moveTo(oldPos[0], oldPos[1])
      context.translate(centerx, centery)
      context.rotate(star.rotation)
      context.translate(-centerx, -centery)
      context.lineTo(star.x, star.y)
      context.stroke()
      
      // Draw the star as a point
      context.beginPath()
      context.arc(star.x, star.y, 1, 0, 2 * Math.PI)
      context.fill()
      context.restore()

      star.prevR = star.rotation
      star.prevX = star.x
      star.prevY = star.y
    }

    const loop = () => {
      const now = new Date().getTime()
      const currentTime = (now - startTimeRef.current) / 50

      context.clearRect(0, 0, cw, ch)

      for (let i = 0; i < starsRef.current.length; i++) {
        if (starsRef.current[i] !== undefined) {
          drawStar(starsRef.current[i], currentTime)
        }
      }

      animationIdRef.current = requestAnimationFrame(loop)
    }

    // Initial clear
    context.clearRect(0, 0, cw, ch)

    loop()

    const handleResize = () => {
      if (!containerRef.current || !canvasRef.current) return
      
      const newH = containerRef.current.offsetHeight
      const newW = containerRef.current.offsetWidth
      
      canvasRef.current.width = newW
      canvasRef.current.height = newH
      setDPI(canvasRef.current, 192)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current)
      }
    }
  }, [])

  const handleClick = () => {
    collapseRef.current = false
    expanseRef.current = true
    returningRef.current = false
    setIsOpen(true)
    
    setTimeout(() => {
      expanseRef.current = false
      returningRef.current = true
      
      setTimeout(() => {
        returningRef.current = false
        setIsOpen(false)
      }, 8000)
    }, 25000)
  }

  const handleMouseOver = () => {
    if (!expanseRef.current) {
      collapseRef.current = true
    }
  }

  const handleMouseOut = () => {
    if (!expanseRef.current) {
      collapseRef.current = false
    }
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-transparent overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="relative z-[1] w-full h-full m-auto"
      />
      <div 
        className={`
          w-[255px] h-[255px] bg-transparent rounded-full 
          absolute left-1/2 top-1/2 -mt-[128px] -ml-[128px] 
          z-[2] cursor-pointer leading-[255px] text-center 
          transition-all duration-500
          ${isOpen ? 'opacity-0 pointer-events-none' : ''}
        `}
        onClick={handleClick}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      >
        <span className="
          text-[#666] font-serif text-lg relative transition-all duration-500
          hover:text-[#DDD]
          before:content-[''] before:inline-block before:h-px before:w-4 
          before:mr-3 before:mb-1 before:bg-[#666] before:transition-all before:duration-500
          after:content-[''] after:inline-block after:h-px after:w-4 
          after:ml-3 after:mb-1 after:bg-[#666] after:transition-all after:duration-500
          hover:before:bg-[#DDD] hover:after:bg-[#DDD]
        ">
          ENTER
        </span>
      </div>
    </div>
  )
}