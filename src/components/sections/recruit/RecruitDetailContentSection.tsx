'use client'

import { RecruitPost, RecruitListItem } from '@/types/recruit'
import RecruitItem from '@/components/ui/RecruitItem'
import TransitionLink from '@/components/ui/TransitionLink'

interface RecruitDetailContentSectionProps {
  post: RecruitPost
  allRecruits: RecruitListItem[]
}


export default function RecruitDetailContentSection({ post, allRecruits }: RecruitDetailContentSectionProps) {
  // 関連求人を取得（同じjobTypeで、現在の求人を除く、最大4件）
  const relatedRecruits = allRecruits
    .filter(recruit => recruit.jobType === post.jobType && recruit.id !== post.id)
    .slice(0, 4)

  return (
    <div className="bg-white pt-16 md:pt-24">
      {/* 上部: ヘッダー部分 */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6">
            {/* Category Tag */}
            <span className="inline-block text-xs text-gray-500 border border-gray-300 px-3 py-1 rounded">
              {post.category}
            </span>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 leading-tight">
              {post.title}
            </h1>

            {/* Date */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/年|月/g, '').toUpperCase()}
              </div>
              <div className="text-xs text-gray-400">5 MIN</div>
            </div>

            {/* Summary */}
            <p className="text-gray-600 text-base leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* 左上: カテゴリタグ */}
            <div className="col-span-2">
              <span className="text-xs text-gray-500 border border-gray-300 px-3 py-1 rounded">
                {post.category}
              </span>
            </div>

            {/* 中央: タイトルと説明文 */}
            <div className="col-span-8 border-r border-gray-700 pr-8">
              <h1 className="text-4xl lg:text-5xl font-medium text-gray-900 mb-4 leading-tight">
                {post.title}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {post.summary}
              </p>
            </div>

            {/* 右側: 日付とその他の情報 */}
            <div className="col-span-2">
              <div className="text-right">
                <div className="text-sm text-gray-500 mb-2">{new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/年|月/g, '').toUpperCase()}</div>
                <div className="text-xs text-gray-400 mb-1">{new Date(post.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }).toUpperCase()}</div>
                <div className="text-xs text-gray-400 mb-4">{new Date(post.date).getFullYear()}</div>
                <div className="text-xs text-gray-400">5 MIN</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 中部: 画像が横幅いっぱい */}
      <section className="w-full px-4 max-w-[1500px] mx-auto">
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full h-48 md:h-96 lg:h-[700px] object-cover"
        />
      </section>

      {/* 下部: コンテンツ部分 */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="max-w-none prose prose-gray">
              <div
                className="leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: post.content
                    .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-6 mb-4">$1</h1>')
                    .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
                    .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-gray-800 mt-4 mb-2">$1</h3>')
                    .replace(/^\*\*(.+)\*\*$/gm, '<p class="font-semibold text-gray-900 mb-3">$1</p>')
                    .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
                    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')
                    .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed text-sm">')
                    .replace(/^(.+)$/gm, '<p class="mb-4 text-gray-600 leading-relaxed text-sm">$1</p>')
                    .replace(/---/g, '<hr class="my-6 border-gray-300" />')
                }}
              />
            </div>

            {/* Mobile Apply Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-4">応募する</h4>
              <TransitionLink
                href="/recruit/apply"
                className="inline-block px-6 py-3 bg-gray-900 text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
              >
                応募フォームへ
              </TransitionLink>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* 左側: メインコンテンツ */}
            <div className="col-span-2"></div>
            <div className="col-span-8 border-r border-gray-700 pr-8">
              <div className="max-w-none prose prose-lg prose-gray">
                <div
                  className="leading-relaxed"
                  dangerouslySetInnerHTML={{
                    __html: post.content
                      .replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold text-gray-900 mt-8 mb-6">$1</h1>')
                      .replace(/^## (.+)$/gm, '<h2 class="text-2xl font-semibold text-gray-800 mt-8 mb-4">$1</h2>')
                      .replace(/^### (.+)$/gm, '<h3 class="text-xl font-medium text-gray-800 mt-6 mb-3">$1</h3>')
                      .replace(/^\*\*(.+)\*\*$/gm, '<p class="font-semibold text-gray-900 mb-4">$1</p>')
                      .replace(/^- (.+)$/gm, '<li class="ml-4 mb-2">$1</li>')
                      .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 mb-2 list-decimal">$2</li>')
                      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-600 leading-relaxed">')
                      .replace(/^(.+)$/gm, '<p class="mb-4 text-gray-600 leading-relaxed">$1</p>')
                      .replace(/---/g, '<hr class="my-8 border-gray-300" />')
                  }}
                />
              </div>
            </div>

            {/* 右側: サイドバー */}
            <div className="col-span-2">
              <div className="sticky top-8">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">募集要項</h3>
                  <p className="text-sm text-gray-600 leading-relaxed mb-4">
                    {post.summary}
                  </p>
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
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

                <div className="mt-8">
                  <TransitionLink
                    href="/recruit/apply"
                    className="inline-block w-full px-4 py-3 bg-gray-900 text-white text-sm font-medium rounded text-center hover:bg-gray-800 transition-colors"
                  >
                    応募フォームへ
                  </TransitionLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 関連求人セクション */}
      {relatedRecruits.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50">
          <div className="w-full max-w-[1500px] mx-auto px-4">
          <div className="my-6 md:my-8">
            <p className="text-sm lg:text-base text-gray-600">あなたにぴったりのポジションがきっと見つかります。</p>
            <p className="text-3xl lg:text-6xl">Discover more opportunities that match your skills.</p>
          </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {relatedRecruits.map((item) => (
                <RecruitItem
                  key={item.id}
                  item={item}
                  showDivider={true}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
