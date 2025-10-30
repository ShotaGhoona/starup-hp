'use client'

import { NewsPost } from '@/types/news'
import MarkdownContent from '@/components/ui/MarkdownContent'
import ShareButtons from '@/components/ui/ShareButtons'
import Image from 'next/image'

interface NewsDetailContentSectionProps {
  post: NewsPost
}

// デフォルト画像パス
const DEFAULT_NEWS_IMAGE = '/images/news/news-detail/s-1470x816_v-fms_webp_033766ae-ae48-42b4-8f69-9d944c37b6f2.webp'

// 画像を返す関数（画像が指定されていない場合はデフォルトを使用）
function getNewsImage(customImage?: string): string {
  return customImage || DEFAULT_NEWS_IMAGE
}

export default function NewsDetailContentSection({ post }: NewsDetailContentSectionProps) {
  return (
    <div className="bg-white pt-16 md:pt-24">
      {/* 上部: ヘッダー部分 */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Mobile Layout */}
          <div className="block lg:hidden space-y-6">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="inline-block text-xs text-gray-500 border border-gray-300 px-3 py-1 rounded">
                  #{tag}
                </span>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-medium text-gray-900 leading-tight">
              {post.title}
            </h1>
            
            {/* Date */}
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString('ja-JP', { year: 'numeric', month: 'short', day: 'numeric' }).replace(/年|月/g, '').toUpperCase()}
              </div>
            </div>
            
            {/* Summary */}
            <p className="text-gray-600 text-base leading-relaxed">
              {post.summary}
            </p>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* 左上: タグ */}
            <div className="col-span-2">
              <div className="flex flex-col gap-2">
                {post.tags.map((tag, index) => (
                  <span key={index} className="text-xs text-gray-500 border border-gray-300 px-3 py-1 rounded inline-block">
                    #{tag}
                  </span>
                ))}
              </div>
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
        <div className="relative w-full h-48 md:h-96 lg:h-[700px]">
          <Image
            src={getNewsImage(post.thumbnail)}
            alt={post.title}
            fill
            sizes="(max-width: 1500px) 100vw, 1500px"
            className="object-cover"
            loading="lazy"
            quality={80}
          />
        </div>
      </section>

      {/* 下部: コンテンツ部分 */}
      <section className="py-12 md:py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          {/* Mobile Layout */}
          <div className="block lg:hidden">
            <div className="max-w-none prose prose-gray">
              <MarkdownContent content={post.content} variant="mobile" />
            </div>
            
            {/* Mobile Share Section */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Share</h4>
              <ShareButtons title={post.title} variant="horizontal" />
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden lg:grid grid-cols-12 gap-8">
            {/* 左側: メインコンテンツ */}
            <div className="col-span-2"></div>
            <div className="col-span-8 border-r border-gray-700 pr-8">
              <div className="max-w-none prose prose-lg prose-gray">
                <MarkdownContent content={post.content} variant="desktop" />
              </div>
            </div>

            {/* 右側: サイドバー（SNSなど） */}
            <div className="col-span-2">
              <div className="sticky top-8">
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Article Info</h3>
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
                  <h4 className="text-sm font-medium text-gray-900 mb-4">Share</h4>
                  <ShareButtons title={post.title} variant="vertical" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}