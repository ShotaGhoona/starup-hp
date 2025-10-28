"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface TypingTextProps {
  text: string
  className?: string
}

export default function TypingText({ text, className = "" }: TypingTextProps) {
  const typingTextRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!typingTextRef.current) return

    const chars = text.split('').map((char) =>
      `<span class="char" style="opacity: 0; display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')

    typingTextRef.current.innerHTML = chars
    const charElements = typingTextRef.current.querySelectorAll('.char')

    gsap.timeline({
      scrollTrigger: {
        trigger: typingTextRef.current,
        start: "top 80%",
        end: "top 60%",
        toggleActions: "play none none reverse"
      }
    })
    .to(charElements, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.02,
      ease: "none"
    })

    return () => {
      ScrollTrigger.getAll().forEach(st => st.kill())
    }
  }, [text])

  return <p ref={typingTextRef} className={className}></p>
}
