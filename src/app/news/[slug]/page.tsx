import { notFound } from 'next/navigation'
import { getAllNewsPostSlugs, getNewsPostBySlug } from '@/lib/mdx'
import NewsDetailContentSection from '@/components/sections/news/NewsDetailContentSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

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
        <Header />
        <NewsDetailContentSection post={post} />
        <Footer />
      </div>
    )
  } catch {
    notFound()
  }
}