'use client'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { companySNS } from '@/data/company'
import Select from '@/components/ui/Select'

gsap.registerPlugin(ScrollTrigger)

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    subject: '',
    email: '',
    message: ''
  })
  
  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)[]>([])
  
  const [typedPlaceholders, setTypedPlaceholders] = useState<string[]>(['', '', '', '', ''])
  
  const originalPlaceholders = [
    "山田太郎",
    "株式会社XXXX", 
    "example@email.com",
    "お問い合わせ内容をご記入ください...",
    ""
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const typePlaceholder = (index: number, text: string, delay = 0) => {
    if (!text) return
    
    let currentText = ""
    const chars = text.split('')
    
    chars.forEach((char, charIndex) => {
      setTimeout(() => {
        currentText += char
        setTypedPlaceholders(prev => {
          const newPlaceholders = [...prev]
          newPlaceholders[index] = currentText
          return newPlaceholders
        })
      }, delay + charIndex * 50)
    })
  }

  useEffect(() => {
    if (!titleRef.current || !sectionRef.current) return

    const titleElement = titleRef.current
    const text = "Say hello"
    
    // タイトルの文字を分割
    const chars = text.split('').map((char, i) => 
      `<span class="char" style="opacity: 0; display: inline-block;">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('')
    titleElement.innerHTML = chars

    const charElements = titleElement.querySelectorAll('.char')
    
    // ScrollTriggerでタイピングアニメーション
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          // プレースホルダーのタイピング開始
          originalPlaceholders.forEach((placeholder, index) => {
            if (placeholder) {
              typePlaceholder(index, placeholder, index * 300)
            }
          })
        },
        onLeaveBack: () => {
          // リセット
          setTypedPlaceholders(['', '', '', '', ''])
        }
      }
    })
    
    tl.to(charElements, {
      opacity: 1,
      duration: 0.05,
      stagger: 0.1,
      ease: "none"
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section ref={sectionRef} id="contact" className="py-12 md:py-20 bg-white relative z-10" data-bg="light">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
          {/* Left Section */}
          <div className="space-y-12 md:space-y-16">
            {/* Header */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-gray-900 mb-6 md:mb-8">
                Let&apos;s collaborate
              </h2>
              <p className="text-gray-600 text-base md:text-lg">
                プロジェクトのご相談や質問はお気軽にお声がけください。
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-2 gap-8 md:gap-12">
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Find us
                </h3>
                <div className="flex space-x-4">
                  {/* X (Twitter) */}
                  <a href={companySNS.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  
                  {/* Note */}
                  <a href={companySNS.note} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </a>
                  
                  {/* LinkedIn */}
                  <a href={companySNS.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  Kyoto, Japan
                </h3>
                <p className="text-gray-400 text-sm">
                  hello@starup01.jp
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div>
            <h3 ref={titleRef} className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">Say hello</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Subject Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    氏名
                  </label>
                  <input
                    ref={el => { inputRefs.current[0] = el }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[0]}
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    件名
                  </label>
                  <Select
                    name="subject"
                    value={formData.subject}
                    onChange={(value) => handleSelectChange('subject', value)}
                    options={[
                      { value: 'general', label: 'お問い合わせ' },
                      { value: 'business', label: 'ビジネスパートナーシップ' },
                      { value: 'career', label: 'キャリア採用' },
                      { value: 'support', label: 'サポート' }
                    ]}
                    placeholder="件名を選択してください"
                  />
                </div>
              </div>

              {/* Company and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    会社名
                  </label>
                  <input
                    ref={el => { inputRefs.current[1] = el }}
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[1]}
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    メールアドレス
                  </label>
                  <input
                    ref={el => { inputRefs.current[2] = el }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[2]}
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  メッセージ
                </label>
                <textarea
                  ref={el => { inputRefs.current[3] = el }}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={typedPlaceholders[3]}
                  rows={4}
                  className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 md:pt-8">
                <button
                  type="submit"
                  className="group flex items-center text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="text-base md:text-lg font-medium underline underline-offset-4">送信する</span>
                  <svg 
                    className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}