import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDirectory = path.join(process.cwd(), 'content')

export interface NewsPost {
  slug: string
  title: string
  date: string
  category: string
  summary: string
  content: string
}

export function getAllNewsPostSlugs(): string[] {
  const newsDirectory = path.join(contentDirectory, 'news')
  const filenames = fs.readdirSync(newsDirectory)
  return filenames
    .filter(name => name.endsWith('.mdx'))
    .map(name => name.replace(/\.mdx$/, ''))
}

export function getNewsPostBySlug(slug: string): NewsPost {
  const newsDirectory = path.join(contentDirectory, 'news')
  const fullPath = path.join(newsDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    summary: data.summary,
    content,
  }
}

export function getAllNewsPosts(): NewsPost[] {
  const slugs = getAllNewsPostSlugs()
  const posts = slugs
    .map(slug => getNewsPostBySlug(slug))
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))
  
  return posts
}

export function getNewsPostsForHomepage(limit: number = 3): NewsPost[] {
  const allPosts = getAllNewsPosts()
  return allPosts.slice(0, limit)
}

export interface RecruitPost {
  slug: string
  title: string
  date: string
  category: string
  summary: string
  content: string
  jobType: string
  location: string
  employmentType: string
}

export function getAllRecruitPostSlugs(): string[] {
  const recruitDirectory = path.join(contentDirectory, 'recruit')
  const filenames = fs.readdirSync(recruitDirectory)
  return filenames
    .filter(name => name.endsWith('.mdx'))
    .map(name => name.replace(/\.mdx$/, ''))
}

export function getRecruitPostBySlug(slug: string): RecruitPost {
  const recruitDirectory = path.join(contentDirectory, 'recruit')
  const fullPath = path.join(recruitDirectory, `${slug}.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title,
    date: data.date,
    category: data.category,
    summary: data.summary,
    content,
    jobType: data.jobType,
    location: data.location,
    employmentType: data.employmentType,
  }
}

export function getAllRecruitPosts(): RecruitPost[] {
  const slugs = getAllRecruitPostSlugs()
  const posts = slugs
    .map(slug => getRecruitPostBySlug(slug))
    .sort((a, b) => (new Date(b.date).getTime() - new Date(a.date).getTime()))

  return posts
}

export function getRecruitPostsForHomepage(limit: number = 3): RecruitPost[] {
  const allPosts = getAllRecruitPosts()
  return allPosts.slice(0, limit)
}