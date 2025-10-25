'use client'

import { useState, useMemo } from 'react'
import { RecruitListItem } from '@/lib/recruit'
import RecruitItem from '@/components/ui/RecruitItem'
import { PhotoGalleryWall } from '@/components/animation/photo-wall/PhotoGalleryWall'

interface RecruitListSectionProps {
  recruits: RecruitListItem[]
}

export default function RecruitListSection({ recruits }: RecruitListSectionProps) {
  const allRecruits = recruits

  // フィルター状態
  const [selectedJobType, setSelectedJobType] = useState<string>('すべて')
  const [selectedLocation, setSelectedLocation] = useState<string>('すべて')
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string>('すべて')

  // 一意のフィルターオプションを取得
  const jobTypes = useMemo(() => {
    const types = new Set(allRecruits.map(r => r.jobType))
    return ['すべて', ...Array.from(types)]
  }, [allRecruits])

  const locations = useMemo(() => {
    const locs = new Set(allRecruits.map(r => r.location))
    return ['すべて', ...Array.from(locs)]
  }, [allRecruits])

  const employmentTypes = useMemo(() => {
    const types = new Set(allRecruits.map(r => r.employmentType))
    return ['すべて', ...Array.from(types)]
  }, [allRecruits])

  // フィルタリング処理
  const filteredRecruits = useMemo(() => {
    return allRecruits.filter((recruit) => {
      const matchesJobType = selectedJobType === 'すべて' || recruit.jobType === selectedJobType
      const matchesLocation = selectedLocation === 'すべて' || recruit.location === selectedLocation
      const matchesEmploymentType = selectedEmploymentType === 'すべて' || recruit.employmentType === selectedEmploymentType

      return matchesJobType && matchesLocation && matchesEmploymentType
    })
  }, [allRecruits, selectedJobType, selectedLocation, selectedEmploymentType])

  const FilterButton = ({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) => (
    <button
      onClick={onClick}
      className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 ${
        active
          ? 'bg-gray-900 text-white'
          : 'bg-white text-gray-600 hover:bg-gray-200'
      }`}
    >
      {children}
    </button>
  )

  return (
    <section className="flex flex-col items-center justify-center bg-white pt-20 md:pt-40">
      <div className="w-full max-w-[1500px] mx-auto px-4">
        <h2 className="text-4xl md:text-7xl text-gray-900 leading-relaxed">Careers</h2>
        <div className="my-6 md:my-8">
          <p className="text-sm lg:text-base text-gray-600">私たちと一緒に未来を創りませんか。</p>
          <p className="text-3xl lg:text-6xl">Join us to create the future together.</p>
        </div>

        {/* 写真と文言セクション */}
        <div className="my-16 md:my-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* 写真 */}
          <div className="w-full">
            <img src="/images/about/company.jpg" alt="recruit-list-section" className="w-full h-full object-cover" />
          </div>
          {/* 文言 */}
          <div className="space-y-6 text-gray-800">
            <div className="flex items-center gap-2 justify-start items-end border-b border-gray-200 pb-2">
            <h2 className="text-2xl">Ideal Candidate</h2>
            <h3 className="text-gray-500 text-base">求める人物像</h3>

            </div>
            <p className="text-base md:text-base leading-relaxed">
              STAR UPは「それ、おもろくね？」と感じる
              プロダクトを世の中に生み出し続ける会社を目指しています。
              それは既存の市場にさらによくしたり、新しい市場を生み出す、壮大なチャレンジです。
              その実現のためには、世の中に必要な仕組みやプロダクトを構想する力、
              それを実現するプロダクトを生み出す力も、どれも欠かすことはできません。
            </p>

            <div className="space-y-4">
              <p className="text-base md:text-base font-semibold">
                私たちが共に働く方に求めるのは、Valueにもある通り以下の4つです。
              </p>
              <ol className="space-y-2 text-sm md:text-base pl-4">
                <li>1. 社内外、社会に対してのポジティブな貢献意欲があること</li>
                <li>2. 常にオーナーシップを持って意思決定を行うこと</li>
                <li>3. 真に世の中が求めているものを追求すること</li>
                <li>4. 高い知的好奇心を持っていること</li>
              </ol>
            </div>

            <p className="text-base md:text-base leading-relaxed">
              上記のValueに共感してくれる人には、様々な領域でエキサイティングな<br />
              環境をご用意します。ぜひよりよい世界を共に実現しましょう！
            </p>
          </div>
        </div>
        <div className='bg-gray-100 p-8 rounded-lg'>
        
          {/* フィルターセクション */}
          <div className="mb-12 space-y-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* 職種フィルター */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">職種</h3>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((type) => (
                  <FilterButton
                    key={type}
                    active={selectedJobType === type}
                    onClick={() => setSelectedJobType(type)}
                  >
                    {type}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* 勤務地フィルター */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">勤務地</h3>
              <div className="flex flex-wrap gap-2">
                {locations.map((location) => (
                  <FilterButton
                    key={location}
                    active={selectedLocation === location}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location}
                  </FilterButton>
                ))}
              </div>
            </div>

            {/* 契約形態フィルター */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">契約形態</h3>
              <div className="flex flex-wrap gap-2">
                {employmentTypes.map((type) => (
                  <FilterButton
                    key={type}
                    active={selectedEmploymentType === type}
                    onClick={() => setSelectedEmploymentType(type)}
                  >
                    {type}
                  </FilterButton>
                ))}
              </div>
            </div>
          </div>

          {/* 採用情報一覧 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredRecruits.map((item) => (
              <RecruitItem
                key={item.id}
                item={item}
                showDivider={true}
              />
            ))}
          </div>
        </div>
        {/* 結果が0件の場合 */}
        {filteredRecruits.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">該当する求人が見つかりませんでした。</p>
            <button
              onClick={() => {
                setSelectedJobType('すべて')
                setSelectedLocation('すべて')
                setSelectedEmploymentType('すべて')
              }}
              className="mt-4 text-sm text-gray-700 hover:text-gray-900 underline"
            >
              フィルターをリセット
            </button>
          </div>
        )}
      </div>
      <div className='mt-24'>
        <PhotoGalleryWall />
      </div>
    </section>
  )
}
