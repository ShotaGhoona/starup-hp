import { notFound } from 'next/navigation'
import { getAllNewsIds, getNewsPostById } from '@/lib/news'
import NewsDetailContentSection from '@/components/sections/news/NewsDetailContentSection'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

interface NewsPostPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const ids = await getAllNewsIds()
  return ids.map((id) => ({
    slug: id, // Using numeric ID as slug
  }))
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params

  const post = await getNewsPostById(slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <NewsDetailContentSection post={post} />
      <Footer />
    </div>
  )
}