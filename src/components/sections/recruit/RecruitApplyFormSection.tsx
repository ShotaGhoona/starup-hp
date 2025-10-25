'use client'
import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Select from '@/components/ui/Select'

gsap.registerPlugin(ScrollTrigger)

export default function RecruitApplyFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    position: '',
    resume: null as File | null,
    portfolio: '',
    message: ''
  })

  const titleRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const inputRefs = useRef<(HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null)[]>([])

  const [typedPlaceholders, setTypedPlaceholders] = useState<string[]>(['', '', '', '', '', ''])

  const originalPlaceholders = [
    "山田太郎",
    "example@email.com",
    "090-1234-5678",
    "https://portfolio.example.com",
    "自己PRや志望動機をご記入ください...",
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({
        ...prev,
        resume: e.target.files![0]
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log('Application submitted:', formData)
    alert('応募ありがとうございます。担当者より追って連絡いたします。')
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
    const text = "Join our team"

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
          setTypedPlaceholders(['', '', '', '', '', ''])
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
    <section ref={sectionRef} className="pb-12 md:pb-20 pt-20 md:pt-40 bg-white relative z-10" data-bg="light">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 md:gap-16 lg:gap-20">
          {/* Left Section */}
          <div className="space-y-12 md:space-y-16">
            {/* Header */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-gray-900 mb-6 md:mb-8">
                Apply Form
              </h2>
              <p className="text-gray-600 text-base md:text-lg mb-6">
                あなたのスキルと情熱を、私たちのチームで活かしませんか。
              </p>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 gap-8 md:gap-12">

              <div>
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">
                  選考フロー
                </h3>
                <ol className="text-gray-600 text-sm space-y-1">
                  <li>1. 書類選考</li>
                  <li>2. 一次面談</li>
                  <li>3. 技術面接</li>
                  <li>4. 最終面接</li>
                  <li>5. オファー</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Right Section - Application Form */}
          <div>
            <h3 ref={titleRef} className="text-xl md:text-2xl text-gray-600 mb-6 md:mb-8">Join our team</h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    氏名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={el => { inputRefs.current[0] = el }}
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[0]}
                    required
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    メールアドレス <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={el => { inputRefs.current[1] = el }}
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[1]}
                    required
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>
              </div>

              {/* Phone and Position Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    電話番号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    ref={el => { inputRefs.current[2] = el }}
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={typedPlaceholders[2]}
                    required
                    className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                    応募職種 <span className="text-red-500">*</span>
                  </label>
                  <Select
                    name="position"
                    value={formData.position}
                    onChange={(value) => handleSelectChange('position', value)}
                    options={[
                      { value: 'frontend', label: 'フロントエンドエンジニア' },
                      { value: 'backend', label: 'バックエンドエンジニア' },
                      { value: 'pm', label: 'プロダクトマネージャー' },
                      { value: 'designer', label: 'デザイナー' },
                      { value: 'other', label: 'その他' }
                    ]}
                    placeholder="選択してください"
                    required
                  />
                </div>
              </div>

              {/* Portfolio URL */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  ポートフォリオURL（任意）
                </label>
                <input
                  ref={el => { inputRefs.current[3] = el }}
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder={typedPlaceholders[3]}
                  className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                  自己PR・志望動機 <span className="text-red-500">*</span>
                </label>
                <textarea
                  ref={el => { inputRefs.current[4] = el }}
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={typedPlaceholders[4]}
                  rows={6}
                  required
                  className="w-full border-0 border-b border-gray-300 bg-transparent py-3 text-gray-900 placeholder-gray-400 focus:border-gray-600 focus:outline-none focus:ring-0 resize-none"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-6 md:pt-8">
                <button
                  type="submit"
                  className="group flex items-center text-gray-900 hover:text-gray-600 transition-colors"
                >
                  <span className="text-base md:text-lg font-medium underline underline-offset-4">応募する</span>
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
