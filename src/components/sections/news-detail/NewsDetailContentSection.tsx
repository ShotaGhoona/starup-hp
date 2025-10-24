'use client'

import { NewsPost } from '@/lib/mdx'

interface NewsDetailContentSectionProps {
  post: NewsPost
}

// カテゴリに応じた画像を返す関数
function getNewsImage(category: string): string {
  const imageMap: { [key: string]: string } = {
    'プレスリリース': 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1500&h=700&fit=crop',
    '事業提携': 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=1500&h=700&fit=crop',
    '会社情報': 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1500&h=700&fit=crop',
    'サービス情報': 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=1500&h=700&fit=crop',
    '開発情報': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=1500&h=700&fit=crop',
  }
  
  return imageMap[category] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1500&h=700&fit=crop'
}

export default function NewsDetailContentSection({ post }: NewsDetailContentSectionProps) {
  return (
    <div className="bg-white pt-24">
      {/* 上部: ヘッダー部分 */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
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
      <section className="w-full px-4 sm:px-6 md:px-8 lg:px-12">
        <img
          src={getNewsImage(post.category)}
          alt={post.title}
          className="w-full h-[700px] object-cover"
        />
      </section>

      {/* 下部: コンテンツ部分 */}
      <section className="py-16">
        <div className="max-w-[1500px] mx-auto px-4">
          <div className="grid grid-cols-12 gap-8">
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
                  <div className="flex flex-col gap-3">
                    <button className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                      </svg>
                      Twitter
                    </button>
                    <button className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      LinkedIn
                    </button>
                    <button className="flex items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.749-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                      </svg>
                      Pinterest
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}