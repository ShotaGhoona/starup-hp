import { notFound } from 'next/navigation'
import { getAllNewsPostSlugs, getNewsPostBySlug } from '@/lib/mdx'
import NewsDetailHeroSection from '@/components/sections/news-detail/NewsDetailHeroSection'
import NewsDetailContentSection from '@/components/sections/news-detail/NewsDetailContentSection'

interface NewsPostPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  const slugs = getAllNewsPostSlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params
  
  try {
    const post = getNewsPostBySlug(slug)
    
    return (
      <div className="min-h-screen">
        <NewsDetailHeroSection post={post} />
        <NewsDetailContentSection post={post} />
      </div>
    )
  } catch {
    notFound()
  }
}