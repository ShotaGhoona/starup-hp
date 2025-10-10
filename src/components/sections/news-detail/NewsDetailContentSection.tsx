import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { NewsPost } from '@/lib/mdx'

interface NewsDetailContentSectionProps {
  post: NewsPost
}

export default function NewsDetailContentSection({ post }: NewsDetailContentSectionProps) {
  return (
    <section className="relative py-20 px-8">
      <div className="relative max-w-4xl mx-auto">
        <article className="bg-white rounded-lg p-8">
          <div className="prose prose-lg prose-gray max-w-none">
            <div
              className="leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/^# (.+)$/gm, '<h1 class="text-2xl font-bold text-gray-900 mt-8 mb-4">$1</h1>')
                  .replace(/^## (.+)$/gm, '<h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">$1</h2>')
                  .replace(/^### (.+)$/gm, '<h3 class="text-lg font-medium text-gray-800 mt-4 mb-2">$1</h3>')
                  .replace(/^\*\*(.+)\*\*:/gm, '<strong class="font-semibold text-gray-900">$1</strong>:')
                  .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
                  .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
                  .replace(/\n\n/g, '</p><p class="mb-4">')
                  .replace(/^(.+)$/gm, '<p class="mb-4">$1</p>')
                  .replace(/---/g, '<hr class="my-8 border-gray-300" />')
              }}
            />
          </div>
        </article>

        <div className="mt-8 text-center">
          <Link
            href="/news"
            className="inline-flex items-center px-6 py-3 text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors rounded-md"
          >
            他のニュースを見る
          </Link>
        </div>
      </div>
    </section>
  )
}