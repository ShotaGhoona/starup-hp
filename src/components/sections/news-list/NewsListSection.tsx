import Link from 'next/link'
import { getAllNewsPosts } from '@/lib/mdx'

export default function NewsListSection() {
  const posts = getAllNewsPosts()

  return (
    <section className="relative py-20 px-8">
      <div className="relative max-w-7xl mx-auto">
        <div className="space-y-0">
          {posts.map((post, index) => (
            <Link key={post.slug} href={`/news/${post.slug}`}>
              <article className={`block py-8 border-b border-gray-300 hover:bg-gray-50 transition-colors ${index === 0 ? 'border-t border-gray-300' : ''}`}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium text-gray-700 border border-gray-300">
                      {post.category}
                    </span>
                    <time className="text-sm text-gray-500">{post.date}</time>
                  </div>
                  
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 leading-relaxed hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  
                  <div>
                    <p className="text-gray-600 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">現在、ニュースはありません。</p>
          </div>
        )}
      </div>
    </section>
  )
}