import { notFound } from 'next/navigation'
import { getAllNewsPostSlugs, getNewsPostBySlug } from '@/lib/mdx'
import NewsDetailContentSection from '@/components/sections/news-detail/NewsDetailContentSection'
import Header2 from '@/components/layout/Header2'
import Footer2 from '@/components/layout/Footer2'

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
        <Header2 />
        <NewsDetailContentSection post={post} />
        <Footer2 />
      </div>
    )
  } catch {
    notFound()
  }
}