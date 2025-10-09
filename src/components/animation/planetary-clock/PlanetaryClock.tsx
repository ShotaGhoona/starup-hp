'use client'

import { useEffect, useState } from 'react'

interface PlanetaryClockProps {
  className?: string
}

export default function PlanetaryClock({ className = '' }: PlanetaryClockProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    // Add dots to all elements with .dots class - exactly like jQuery
    const dotsElements = document.querySelectorAll('.dots')
    dotsElements.forEach(element => {
      // Clear existing dots first
      const existingDots = element.querySelectorAll('.dot')
      existingDots.forEach(dot => dot.remove())
      
      // Add 60 dots
      for (let i = 0; i < 60; i++) {
        const dot = document.createElement('div')
        dot.className = 'dot'
        dot.style.transform = `translate(-50%,-50%) rotate(${i * 6}deg)`
        element.appendChild(dot)
      }
    })

    // No need for time synchronization - just let it animate freely
  }, [mounted])

  if (!mounted) return null

  return (
    <>
      <div className={`w-screen h-screen bg-[#323133] overflow-hidden ${className}`}>
        <div className="clock dots">
          <div className="main"></div>
          <div className="hour">
            <div className="hand dots">
              <div className="main"></div>
              <div className="minute">
                <div className="hand dots">
                  <div className="main"></div>
                  <div className="second">
                    <div className="hand">
                      <div className="main"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <a href="#" className="feature">
          High-Speed Planetary System
        </a>
      </div>

      <style jsx global>{`
        .clock {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50vh;
          height: 50vh;
          border-radius: 100%;
        }

        .clock .main {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          border: 4px solid #323133;
          border-radius: 100%;
        }

        .clock .hand {
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 50%;
          height: 50%;
        }

        .clock > .main {
          width: 10vh;
          height: 10vh;
          background-color: #FFCE54;
        }

        .clock .dot {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 100%;
        }

        .clock .dot:after {
          content: '';
          position: absolute;
          top: 0px;
          left: 0px;
          transform: translate(-50%, -50%);
          width: 3px;
          height: 3px;
          background-color: #F5F7FA;
          opacity: 0.5;
          border-radius: 100%;
        }

        .clock .dot:nth-child(5n-2):after {
          opacity: 1;
          width: 6px;
          height: 6px;
          background-color: #F5F7FA;
        }

        .clock .hour {
          z-index: 10;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          height: 100%;
          animation: rotate 30s linear infinite;
        }

        .clock .hour > .hand {
          animation: rotate 30s linear infinite reverse;
        }

        .clock .hour > .hand > .main {
          width: 4vh;
          height: 4vh;
          background-color: #5D9CEC;
        }

        .clock .minute {
          z-index: 10;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 9s linear infinite;
          height: 100%;
        }

        .clock .minute > .hand {
          animation: rotate 9s linear infinite reverse;
        }

        .clock .minute > .hand > .main {
          width: 2vh;
          height: 2vh;
          background-color: #AAB2BD;
        }

        .clock .second {
          z-index: 10;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 3s linear infinite;
          height: 100%;
        }

        .clock .second > .hand {
          animation: rotate 3s linear infinite reverse;
        }

        .clock .second > .hand > .main {
          z-index: 10;
          width: 2vh;
          height: 2vh;
          background-color: #AA8E69;
        }

        /* Remove the rule that hides dots on minute orbit - show all 60 dots */

        .feature {
          position: fixed;
          bottom: 10px;
          left: 10px;
          color: #AAB2BD;
          font-family: sans-serif;
          opacity: 0.5;
          font-size: 12px;
          transition: color 0.25s ease, opacity 0.25s ease 1s;
          text-decoration: none;
        }

        .feature:hover {
          transition: color 0.25s ease, opacity 0.25s ease;
          color: #F5F7FA;
          opacity: 1;
        }

        @keyframes rotate {
          0% {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }
      `}</style>
    </>
  )
}