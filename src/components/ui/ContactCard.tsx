'use client'

import { useState } from 'react'
import { Send } from 'lucide-react'

interface ContactCardProps {
  className?: string
  onInputFocus?: (element: HTMLElement) => void
}

export default function ContactCard({ className = '', onInputFocus }: ContactCardProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log('Form submitted:', formData)
  }

  return (
    <div 
      className={`w-full rounded-xl p-6 ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      }}
    >
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">CONTACT US</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-2">
            お名前 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={(e) => onInputFocus?.(e.target)}
            required
            className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 text-sm"
            placeholder="山田太郎"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-2">
            メールアドレス <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={(e) => onInputFocus?.(e.target)}
            required
            className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 text-sm"
            placeholder="example@email.com"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-2">
            会社名
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            onFocus={(e) => onInputFocus?.(e.target)}
            className="w-full px-3 py-2.5 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-gray-900 placeholder-gray-500 text-sm"
            placeholder="株式会社XXXX"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-bold text-gray-900 mb-2">
            メッセージ <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={(e) => onInputFocus?.(e.target)}
            required
            rows={4}
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical text-gray-900 placeholder-gray-500"
            placeholder="お問い合わせ内容をご記入ください..."
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200 flex items-center justify-center space-x-2 text-sm"
        >
          <Send className="w-5 h-5" />
          <span>送信する</span>
        </button>
      </form>
    </div>
  )
}