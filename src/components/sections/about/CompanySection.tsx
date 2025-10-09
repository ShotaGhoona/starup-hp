'use client'

import Background from '@/components/layout/Background'

interface CompanyInfo {
  label: string
  value: string
}

const companyData: CompanyInfo[] = [
  {
    label: '会社名',
    value: '株式会社STAR UP'
  },
  {
    label: '設立',
    value: '2023年11月30日'
  },
  {
    label: '資本金',
    value: '100,000,000円'
  },
  {
    label: '代表',
    value: '緒方 勇斗'
  },
  {
    label: '所在地',
    value: '京都府京都市上京区甲斐守町97西陣産業創造會館109'
  }
]

export default function CompanySection() {
  return (
    <section className="relative py-20 px-8">
      <Background />
      
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-8 gap-12 mb-12">
          <div className="col-span-2">
            <h2 className="text-4xl font-bold text-black mb-2">
              COMPANY
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#7A83FA] to-[#002AF4]"></div>
          </div>
          
          <div className="col-span-6">
            <div className="space-y-0 border-y border-gray-700">
              {companyData.map((info, index) => (
                <div key={info.label} className={`py-6 ${index !== companyData.length - 1 ? 'border-b border-gray-700' : ''}`}>
                  <div className="flex items-center">
                    <div className="w-1/3">
                      <span className="inline-flex items-center text-sm font-medium text-gray-700 ">
                        {info.label}
                      </span>
                    </div>
                    <div className="w-2/3">
                      <p className="text-lg font-normal text-gray-900 leading-relaxed">
                        {info.value}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}