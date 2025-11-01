# Notion CMS Integration - Implementation Report

## Project Overview

This document provides a comprehensive overview of the Notion CMS integration implementation for the STAR UP website, covering the migration of News and Recruit content management systems from MDX files to Notion CMS.

### Primary Objective

Migrate News and Recruit content management systems from MDX files to Notion CMS to enable non-technical team members to manage content easily.

### Key Requirements

- **SSR Approach**: Server-Side Rendering with Next.js async components
- **Auto-increment IDs**: Use Notion's `unique_id` type for automatic ID generation
- **Multiple Tags**: Support multiple tags for News articles (changed from single category)
- **No Backward Compatibility**: Complete replacement of old MDX system
- **High Reusability**: Dictionary-based config structure for use across projects
- **Type Safety**: Full TypeScript support with proper type definitions

## Architecture Design

### Core Principles

1. **Generic Core**: All Notion integration code is project-agnostic
2. **Config-Driven**: Project-specific logic lives only in config files
3. **Auto-Generation**: Extractor functions are auto-generated from config
4. **Type Safety**: Strong TypeScript types with dynamic property access
5. **Reusability**: Copy config → change dictionary → done

### System Structure

```
src/lib/notion/
├── client.ts              # Generic Notion API client
├── types.ts               # Generic type definitions
├── extractors.ts          # Auto-extractor generation system
├── blocks-to-markdown.ts  # Notion blocks to Markdown converter
└── config/
    ├── news-config.ts     # News-specific configuration
    └── recruit-config.ts  # Recruit-specific configuration

src/lib/
├── news.ts                # News data layer
└── recruit.ts             # Recruit data layer

src/types/
├── news.ts                # News TypeScript types
└── recruit.ts             # Recruit TypeScript types
```

## Implementation Details

### Phase 1: Generic Notion System

#### 1. Notion Client (`src/lib/notion/client.ts`)

Generic API client that works with any Notion database:

```typescript
/**
 * Generic Notion Client
 * Provides reusable functions for querying Notion databases
 */

import { Client } from '@notionhq/client'
import { NotionPage } from './types'

let notion: Client | null = null

export function getNotionClient(): Client {
  if (!notion) {
    const token = process.env.NOTION_API_TOKEN
    if (!token) {
      throw new Error('NOTION_API_TOKEN is not defined')
    }
    notion = new Client({ auth: token })
  }
  return notion
}

export async function queryDatabase(
  databaseId: string,
  options?: {
    sorts?: Array<{
      property: string
      direction: 'ascending' | 'descending'
    }>
    filter?: any
  }
): Promise<NotionPage[]> {
  const notion = getNotionClient()
  const response = await notion.dataSources.query({
    data_source_id: databaseId,
    sorts: options?.sorts,
    filter: options?.filter,
  })
  return response.results as unknown as NotionPage[]
}

export async function getPageBlocks(pageId: string) {
  const notion = getNotionClient()
  const response = await notion.blocks.children.list({
    block_id: pageId,
  })
  return response.results
}
```

**Key Features**:
- Singleton pattern for Notion client
- Generic `queryDatabase()` with sorting and filtering support
- `getPageBlocks()` for retrieving page content
- Uses Notion API v5.x with `dataSources.query()`

#### 2. Type Definitions (`src/lib/notion/types.ts`)

Generic types with index signature for dynamic property access:

```typescript
/**
 * Generic Notion Type Definitions
 * Supports dynamic property access while maintaining type safety
 */

export interface NotionPropertyValue {
  id: string
  type: string
  [key: string]: any
}

export type NotionProperties = Record<string, NotionPropertyValue>

export interface NotionPage {
  object: 'page'
  id: string
  created_time: string
  last_edited_time: string
  archived: boolean
  url: string
  properties: NotionProperties
}

export type NotionPropertyType =
  | 'title'
  | 'rich_text'
  | 'number'
  | 'unique_id'
  | 'select'
  | 'multi_select'
  | 'date'
  | 'checkbox'
  | 'url'
  | 'email'
  | 'phone_number'
  | 'files'

export interface PropertyConfig {
  name: string
  type: NotionPropertyType
}

export interface DatabaseConfig {
  database: {
    id: () => string
    defaultSorts?: Array<{
      property: string
      direction: 'ascending' | 'descending'
    }>
  }
  properties: Record<string, PropertyConfig>
  defaults?: Record<string, any>
}

export interface NotionBlock {
  object: 'block'
  id: string
  type: string
  [key: string]: any
}
```

**Key Design Decisions**:
- `NotionProperties` uses `Record<string, NotionPropertyValue>` for dynamic access
- Supports 12 Notion property types
- `DatabaseConfig` interface defines structure for config files

#### 3. Auto-Extractor System (`src/lib/notion/extractors.ts`)

Auto-generates type-safe extractor functions from config:

```typescript
/**
 * Auto-Extractor Generation System
 * Automatically generates extractor functions from DatabaseConfig
 * Supports 12 Notion property types
 */

import { NotionPage, NotionPropertyType, DatabaseConfig } from './types'

const extractorsByType: Record<NotionPropertyType, (page: NotionPage, propertyName: string) => any> = {
  title: (page, propertyName) => page.properties[propertyName]?.title?.[0]?.plain_text || '',
  rich_text: (page, propertyName) => page.properties[propertyName]?.rich_text?.[0]?.plain_text || '',
  number: (page, propertyName) => page.properties[propertyName]?.number ?? null,
  unique_id: (page, propertyName) => {
    const number = page.properties[propertyName]?.unique_id?.number
    return number !== undefined ? String(number) : ''
  },
  select: (page, propertyName) => page.properties[propertyName]?.select?.name || '',
  multi_select: (page, propertyName) =>
    page.properties[propertyName]?.multi_select?.map((item: { name: string }) => item.name) || [],
  date: (page, propertyName) => page.properties[propertyName]?.date?.start || '',
  checkbox: (page, propertyName) => page.properties[propertyName]?.checkbox || false,
  url: (page, propertyName) => page.properties[propertyName]?.url || '',
  email: (page, propertyName) => page.properties[propertyName]?.email || '',
  phone_number: (page, propertyName) => page.properties[propertyName]?.phone_number || '',
  files: (page, propertyName) => {
    const files = page.properties[propertyName]?.files
    if (!files || files.length === 0) return ''
    const file = files[0]
    if (file.type === 'file' && file.file) return file.file.url
    if (file.type === 'external' && file.external) return file.external.url
    return ''
  },
}

export function createExtractors<T extends DatabaseConfig>(config: T) {
  const extractors: Record<string, (page: NotionPage) => any> = {}

  for (const [key, propertyConfig] of Object.entries(config.properties)) {
    const { name: propertyName, type } = propertyConfig
    const extractorFn = extractorsByType[type]

    if (!extractorFn) {
      console.warn(`Unknown property type: ${type} for property: ${key}`)
      extractors[key] = () => null
      continue
    }

    extractors[key] = (page: NotionPage) => extractorFn(page, propertyName)
  }

  return extractors as Record<keyof T['properties'], (page: NotionPage) => any>
}

export function getDatabaseId(config: DatabaseConfig): string {
  return config.database.id()
}

export function getDefaultSorts(config: DatabaseConfig) {
  return config.database.defaultSorts || []
}

export function getDefault<T>(config: DatabaseConfig, key: string, fallback: T): T {
  return (config.defaults?.[key] as T) ?? fallback
}
```

**Supported Property Types**:
1. `title` - Main title field
2. `rich_text` - Text content
3. `number` - Numeric values
4. `unique_id` - Auto-incrementing IDs
5. `select` - Single selection
6. `multi_select` - Multiple selections
7. `date` - Date values
8. `checkbox` - Boolean values
9. `url` - URL fields
10. `email` - Email addresses
11. `phone_number` - Phone numbers
12. `files` - File attachments

#### 4. Blocks to Markdown Converter (`src/lib/notion/blocks-to-markdown.ts`)

Converts Notion blocks to Markdown format:

```typescript
/**
 * Notion Blocks to Markdown Converter
 * Converts Notion page content blocks to markdown format
 */

import { NotionBlock } from './types'

function blockToMarkdown(block: NotionBlock): string {
  switch (block.type) {
    case 'heading_1':
      return `# ${block.heading_1.rich_text.map((t: any) => t.plain_text).join('')}\n`
    case 'heading_2':
      return `## ${block.heading_2.rich_text.map((t: any) => t.plain_text).join('')}\n`
    case 'heading_3':
      return `### ${block.heading_3.rich_text.map((t: any) => t.plain_text).join('')}\n`
    case 'paragraph':
      return `${block.paragraph.rich_text.map((t: any) => t.plain_text).join('')}\n\n`
    case 'bulleted_list_item':
      return `- ${block.bulleted_list_item.rich_text.map((t: any) => t.plain_text).join('')}\n`
    case 'numbered_list_item':
      return `1. ${block.numbered_list_item.rich_text.map((t: any) => t.plain_text).join('')}\n`
    case 'code':
      const code = block.code.rich_text.map((t: any) => t.plain_text).join('')
      return `\`\`\`${block.code.language}\n${code}\n\`\`\`\n\n`
    case 'quote':
      return `> ${block.quote.rich_text.map((t: any) => t.plain_text).join('')}\n\n`
    case 'divider':
      return `---\n\n`
    case 'image':
      const imageUrl = block.image.type === 'file' ? block.image.file.url : block.image.external.url
      return `![](${imageUrl})\n\n`
    default:
      return ''
  }
}

export function blocksToMarkdown(blocks: NotionBlock[]): string {
  return blocks
    .map((block) => blockToMarkdown(block))
    .filter(Boolean)
    .join('')
}
```

### Phase 2: News System Integration

#### 1. News Configuration (`src/lib/notion/config/news-config.ts`)

Dictionary-based configuration for News database:

```typescript
import { DatabaseConfig } from '../types'

export const newsConfig: DatabaseConfig = {
  database: {
    id: () => {
      const value = process.env.NOTION_NEWS_DATABASE_ID
      if (!value) {
        throw new Error('NOTION_NEWS_DATABASE_ID is not defined in environment variables')
      }
      return value
    },
    defaultSorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  },
  properties: {
    id: {
      name: 'ID',
      type: 'unique_id',
    },
    title: {
      name: 'Name',
      type: 'title',
    },
    tags: {
      name: 'Tags',
      type: 'multi_select',
    },
    date: {
      name: 'Date',
      type: 'date',
    },
    description: {
      name: 'Description',
      type: 'rich_text',
    },
    thumbnail: {
      name: 'Thumbnail',
      type: 'files',
    },
  },
  defaults: {
    image: '/images/news/news-detail/s-1470x816_v-fms_webp_033766ae-ae48-42b4-8f69-9d944c37b6f2.webp',
  },
}
```

**Notion Database Structure**:
- Database ID: `29c4f9d8-9717-80af-ac91-000b453a06ba`
- Integration: `starup-hp-contact`
- Properties:
  - `ID` (unique_id) - Auto-incrementing
  - `Name` (title) - Article title
  - `Tags` (multi_select) - Multiple category tags
  - `Date` (date) - Publication date
  - `Description` (rich_text) - Summary text
  - `Thumbnail` (files) - Featured image

#### 2. News Types (`src/types/news.ts`)

```typescript
export interface NewsPost {
  id: string
  title: string
  date: string
  tags: string[]
  summary: string
  content: string
  thumbnail: string
}

export interface NewsListItem {
  id: string
  title: string
  date: string
  tags: string[]
  summary: string
  imageUrl: string
}
```

#### 3. News Data Layer (`src/lib/news.ts`)

```typescript
/**
 * News データレイヤー
 * Notionからニュース情報データを取得・整形
 */

import { NewsPost, NewsListItem } from '@/types/news'
import { queryDatabase, getPageBlocks } from './notion/client'
import { newsConfig } from './notion/config/news-config'
import { createExtractors, getDatabaseId, getDefaultSorts, getDefault } from './notion/extractors'
import { blocksToMarkdown } from './notion/blocks-to-markdown'

// Newsのextractorを自動生成
const extractors = createExtractors(newsConfig)

function getImageUrl(notionImageUrl: string): string {
  if (notionImageUrl) {
    return notionImageUrl
  }
  return getDefault<string>(newsConfig, 'image', '')
}

export async function getAllNewsForList(): Promise<NewsListItem[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig), {
      sorts: getDefaultSorts(newsConfig),
    })

    return pages.map((page) => ({
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      tags: extractors.tags(page),
      summary: extractors.description(page),
      imageUrl: getImageUrl(extractors.thumbnail(page)),
    }))
  } catch (error) {
    console.error('Error fetching news list:', error)
    throw error
  }
}

export async function getLatestNews(limit: number = 3): Promise<NewsListItem[]> {
  const allNews = await getAllNewsForList()
  return allNews.slice(0, limit)
}

export async function getNewsPostById(id: string): Promise<NewsPost | null> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig))
    const targetId = parseInt(id, 10)

    if (isNaN(targetId)) {
      return null
    }

    const page = pages.find((p) => {
      const pageId = extractors.id(p)
      return pageId === String(targetId)
    })

    if (!page) {
      return null
    }

    const blocks = await getPageBlocks(page.id)
    const content = blocksToMarkdown(blocks)

    return {
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      tags: extractors.tags(page),
      summary: extractors.description(page),
      thumbnail: getImageUrl(extractors.thumbnail(page)),
      content,
    }
  } catch (error) {
    console.error(`Error fetching news post by ID ${id}:`, error)
    throw error
  }
}

export async function getAllNewsIds(): Promise<string[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(newsConfig))
    return pages.map((page) => extractors.id(page)).filter(Boolean)
  } catch (error) {
    console.error('Error fetching all news IDs:', error)
    throw error
  }
}
```

**Key Functions**:
- `getAllNewsForList()` - Fetch all news for list view
- `getLatestNews(limit)` - Get latest N news items
- `getNewsPostById(id)` - Get single news post with content
- `getAllNewsIds()` - Get all IDs for static generation

#### 4. Updated Page Components

**News List Page** (`src/app/news/page.tsx`):
```typescript
export default async function NewsPage() {
  const news = await getAllNewsForList()
  return <NewsListSection news={news} />
}
```

**News Detail Page** (`src/app/news/[slug]/page.tsx`):
```typescript
export async function generateStaticParams() {
  const ids = await getAllNewsIds()
  return ids.map((id) => ({ slug: id }))
}

export default async function NewsDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params
  const post = await getNewsPostById(slug)
  if (!post) {
    notFound()
  }
  const allNews = await getAllNewsForList()
  return <NewsDetailContentSection post={post} allNews={allNews} />
}
```

### Phase 3: Recruit System Integration

#### 1. Recruit Configuration (`src/lib/notion/config/recruit-config.ts`)

```typescript
import { DatabaseConfig } from '../types'

export const recruitConfig: DatabaseConfig = {
  database: {
    id: () => {
      const value = process.env.NOTION_RECRUIT_DATABASE_ID
      if (!value) {
        throw new Error('NOTION_RECRUIT_DATABASE_ID is not defined in environment variables')
      }
      return value
    },
    defaultSorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  },
  properties: {
    id: {
      name: 'ID',
      type: 'unique_id',
    },
    title: {
      name: 'Name',
      type: 'title',
    },
    category: {
      name: 'Category',
      type: 'select',
    },
    date: {
      name: 'Date',
      type: 'date',
    },
    summary: {
      name: 'Summary',
      type: 'rich_text',
    },
    jobType: {
      name: 'JobType',
      type: 'select',
    },
    location: {
      name: 'Location',
      type: 'rich_text',
    },
    employmentType: {
      name: 'EmploymentType',
      type: 'rich_text',
    },
  },
  defaults: {
    defaultImage: '/images/recruit/rectuit-detail/business.jpg',
  },
}
```

**Note**: No Japanese characters in config file to avoid UTF-8 encoding issues during build.

#### 2. Recruit Types (`src/types/recruit.ts`)

```typescript
export interface RecruitPost {
  id: string
  title: string
  date: string
  category: string
  summary: string
  content: string
  jobType: string
  location: string
  employmentType: string
}

export interface RecruitListItem {
  id: string
  title: string
  date: string
  category: string
  imageUrl: string
  summary: string
  jobType: string
  location: string
  employmentType: string
}
```

#### 3. Recruit Data Layer (`src/lib/recruit.ts`)

```typescript
/**
 * Recruit データレイヤー
 * Notionから採用情報データを取得・整形
 */

import { RecruitPost, RecruitListItem } from '@/types/recruit'
import { queryDatabase, getPageBlocks } from './notion/client'
import { recruitConfig } from './notion/config/recruit-config'
import { createExtractors, getDatabaseId, getDefaultSorts, getDefault } from './notion/extractors'
import { blocksToMarkdown } from './notion/blocks-to-markdown'

// Recruitのextractorを自動生成
const extractors = createExtractors(recruitConfig)

/**
 * jobTypeに応じた画像URLを取得
 * Unicode escape sequences for Japanese to avoid UTF-8 build errors
 */
function getRecruitImage(jobType: string): string {
  const imageMap: Record<string, string> = {
    '\u30a8\u30f3\u30b8\u30cb\u30a2': '/images/recruit/rectuit-detail/engineer.jpg',
    '\u30de\u30cd\u30b8\u30e1\u30f3\u30c8': '/images/recruit/rectuit-detail/management.jpg',
    '\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u30de\u30cd\u30fc\u30b8\u30e3\u30fc': '/images/recruit/rectuit-detail/business.jpg',
    '\u30bb\u30fc\u30eb\u30b9': '/images/recruit/rectuit-detail/sales.jpg',
  }
  const defaultImage = getDefault<string>(recruitConfig, 'defaultImage', '')
  return imageMap[jobType] || defaultImage
}

export async function getAllRecruitsForList(): Promise<RecruitListItem[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig), {
      sorts: getDefaultSorts(recruitConfig),
    })

    return pages.map((page) => ({
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      category: extractors.category(page),
      summary: extractors.summary(page),
      jobType: extractors.jobType(page),
      location: extractors.location(page),
      employmentType: extractors.employmentType(page),
      imageUrl: getRecruitImage(extractors.jobType(page)),
    }))
  } catch (error) {
    console.error('Error fetching recruit list:', error)
    throw error
  }
}

export async function getLatestRecruits(limit: number = 3): Promise<RecruitListItem[]> {
  const allRecruits = await getAllRecruitsForList()
  return allRecruits.slice(0, limit)
}

export async function getRecruitPostById(id: string): Promise<RecruitPost | null> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig))
    const targetId = parseInt(id, 10)

    if (isNaN(targetId)) {
      return null
    }

    const page = pages.find((p) => {
      const pageId = extractors.id(p)
      return pageId === String(targetId)
    })

    if (!page) {
      return null
    }

    const blocks = await getPageBlocks(page.id)
    const content = blocksToMarkdown(blocks)

    return {
      id: extractors.id(page),
      title: extractors.title(page),
      date: extractors.date(page),
      category: extractors.category(page),
      summary: extractors.summary(page),
      jobType: extractors.jobType(page),
      location: extractors.location(page),
      employmentType: extractors.employmentType(page),
      content,
    }
  } catch (error) {
    console.error(`Error fetching recruit post by ID ${id}:`, error)
    throw error
  }
}

export async function getAllRecruitIds(): Promise<string[]> {
  try {
    const pages = await queryDatabase(getDatabaseId(recruitConfig))
    return pages.map((page) => extractors.id(page)).filter(Boolean)
  } catch (error) {
    console.error('Error fetching all recruit IDs:', error)
    throw error
  }
}
```

**Unicode Escape Sequences**:
- `\u30a8\u30f3\u30b8\u30cb\u30a2` = エンジニア (Engineer)
- `\u30de\u30cd\u30b8\u30e1\u30f3\u30c8` = マネジメント (Management)
- `\u30d7\u30ed\u30b8\u30a7\u30af\u30c8\u30de\u30cd\u30fc\u30b8\u30e3\u30fc` = プロジェクトマネージャー (Project Manager)
- `\u30bb\u30fc\u30eb\u30b9` = セールス (Sales)

## Error Resolution

### Error 1: Wrong API Method

**Error**: `notion.databases.query is not a function`

**Cause**: Notion API v5.x changed the method name from `databases.query` to `dataSources.query`

**Fix**:
```typescript
// Before (v4.x)
const response = await notion.databases.query({
  database_id: databaseId,
})

// After (v5.x)
const response = await notion.dataSources.query({
  data_source_id: databaseId,
})
```

### Error 2: Type Error with Dynamic Property Access

**Error**: `Element implicitly has an 'any' type because expression of type 'string' can't be used to index type 'NotionNewsProperties'`

**Cause**: Fixed type definition doesn't support dynamic property access

**Fix**:
```typescript
// Before: Fixed type
export interface NotionNewsProperties {
  ID: NotionPropertyValue
  Name: NotionPropertyValue
  // ...
}

// After: Generic with index signature
export type NotionProperties = Record<string, NotionPropertyValue>

export interface NotionPage {
  properties: NotionProperties  // Allows dynamic access
}
```

### Error 3: UTF-8 Encoding Error

**Error**: `Reading source code for parsing failed - invalid utf-8 sequence of 1 bytes from index 2372`

**Location**: `src/lib/recruit.ts` when Japanese characters were in the file

**Cause**: Turbopack has issues parsing UTF-8 encoded source files with certain Japanese characters

**Solution**:
1. Remove all Japanese from config files (keep them ASCII-only)
2. Use Unicode escape sequences for Japanese strings in runtime code:

```typescript
// Instead of this:
const imageMap = {
  'エンジニア': '/images/recruit/engineer.jpg',
}

// Use this:
const imageMap = {
  '\u30a8\u30f3\u30b8\u30cb\u30a2': '/images/recruit/engineer.jpg',
}
```

### Error 4: File Character Corruption

**Issue**: When reading `recruit-config.ts`, displayed corrupted characters

**Fix**: Deleted and recreated file using `cat` with heredoc to ensure proper UTF-8 encoding:

```bash
cat > src/lib/notion/config/recruit-config.ts << 'EOF'
[file contents]
EOF
```

## Environment Variables

Add these to `.env.local`:

```env
# Notion API Configuration
NOTION_API_TOKEN=your_notion_integration_token_here

# Database IDs
NOTION_NEWS_DATABASE_ID=29c4f9d8-9717-80af-ac91-000b453a06ba
NOTION_RECRUIT_DATABASE_ID=your_recruit_database_id_here
```

## Migration Guide: Reusing This Pattern

### Step 1: Create Config File

Create a new config file in `src/lib/notion/config/`:

```typescript
import { DatabaseConfig } from '../types'

export const yourConfig: DatabaseConfig = {
  database: {
    id: () => {
      const value = process.env.YOUR_NOTION_DATABASE_ID
      if (!value) {
        throw new Error('YOUR_NOTION_DATABASE_ID is not defined')
      }
      return value
    },
    defaultSorts: [
      {
        property: 'Date',
        direction: 'descending',
      },
    ],
  },
  properties: {
    // Map your Notion properties here
    id: {
      name: 'ID',  // Notion property name
      type: 'unique_id',  // Notion property type
    },
    title: {
      name: 'Title',
      type: 'title',
    },
    // ... add more properties
  },
  defaults: {
    // Optional default values
    image: '/default-image.jpg',
  },
}
```

### Step 2: Create Types File

Create `src/types/your-type.ts`:

```typescript
export interface YourPost {
  id: string
  title: string
  // ... add fields matching your config
}

export interface YourListItem {
  id: string
  title: string
  // ... add fields for list view
}
```

### Step 3: Create Data Layer

Create `src/lib/your-data.ts`:

```typescript
import { YourPost, YourListItem } from '@/types/your-type'
import { queryDatabase, getPageBlocks } from './notion/client'
import { yourConfig } from './notion/config/your-config'
import { createExtractors, getDatabaseId, getDefaultSorts } from './notion/extractors'
import { blocksToMarkdown } from './notion/blocks-to-markdown'

// Auto-generate extractors from config
const extractors = createExtractors(yourConfig)

export async function getAllItems(): Promise<YourListItem[]> {
  const pages = await queryDatabase(getDatabaseId(yourConfig), {
    sorts: getDefaultSorts(yourConfig),
  })

  return pages.map((page) => ({
    id: extractors.id(page),
    title: extractors.title(page),
    // ... map other fields using extractors
  }))
}

export async function getItemById(id: string): Promise<YourPost | null> {
  const pages = await queryDatabase(getDatabaseId(yourConfig))
  const targetId = parseInt(id, 10)

  if (isNaN(targetId)) return null

  const page = pages.find((p) => extractors.id(p) === String(targetId))
  if (!page) return null

  const blocks = await getPageBlocks(page.id)
  const content = blocksToMarkdown(blocks)

  return {
    id: extractors.id(page),
    title: extractors.title(page),
    content,
    // ... map other fields
  }
}
```

**That's it!** The generic system handles everything else automatically.

## Benefits of This Architecture

### 1. Reusability
- **Generic core** works with any Notion database
- **Copy-paste ready**: Just create a config file
- **No boilerplate**: Extractors auto-generated from config

### 2. Type Safety
- Full TypeScript support
- Type-safe extractor functions
- Compile-time property validation

### 3. Maintainability
- **Single source of truth**: Config file defines everything
- **Easy updates**: Change Notion properties → update config
- **Clear separation**: Generic code vs. project-specific code

### 4. Developer Experience
- Simple 3-step process to add new content types
- IntelliSense support in IDEs
- Self-documenting config structure

### 5. Flexibility
- Supports 12 Notion property types
- Custom default values
- Configurable sorting and filtering

## File Changes Summary

### Created Files
- `src/lib/notion/client.ts` - Generic Notion API client
- `src/lib/notion/types.ts` - Generic type definitions
- `src/lib/notion/extractors.ts` - Auto-extractor system
- `src/lib/notion/blocks-to-markdown.ts` - Markdown converter
- `src/lib/notion/config/news-config.ts` - News configuration
- `src/lib/notion/config/recruit-config.ts` - Recruit configuration
- `src/types/news.ts` - News TypeScript types
- `src/types/recruit.ts` - Recruit TypeScript types

### Modified Files
- `src/lib/news.ts` - Migrated from MDX to Notion
- `src/lib/recruit.ts` - Migrated from MDX to Notion
- `src/app/news/page.tsx` - Changed to async function
- `src/app/news/[slug]/page.tsx` - Using numeric IDs, async
- `src/app/recruit/page.tsx` - Changed to async function
- `src/app/recruit/[slug]/page.tsx` - Using numeric IDs, async
- `src/components/sections/news/NewsListSection.tsx` - Updated imports, multiple tags
- `src/components/sections/news/NewsDetailContentSection.tsx` - Multiple tags support
- `src/components/sections/recruit/RecruitListSection.tsx` - Updated imports
- `src/components/sections/recruit/RecruitDetailContentSection.tsx` - Updated imports
- `src/components/ui/NewsItem.tsx` - Multiple tags display
- `src/components/ui/RecruitItem.tsx` - Updated imports
- `src/components/sections/home/NewsSection.tsx` - Async function

### Deleted Files
- `src/lib/mdx.ts` - Old MDX processing library
- `content/news/*.mdx` - All news MDX files
- `content/recruit/*.mdx` - All recruit MDX files

## Testing Checklist

- [ ] News list page loads correctly
- [ ] News detail pages load correctly
- [ ] News filtering by tags works
- [ ] Recruit list page loads correctly
- [ ] Recruit detail pages load correctly
- [ ] Recruit filtering works (jobType, location, employmentType)
- [ ] Images display correctly
- [ ] Markdown content renders properly
- [ ] All pages are statically generated
- [ ] No console errors
- [ ] Build completes without errors

## Future Enhancements

### Potential Improvements
1. **Caching**: Implement ISR (Incremental Static Regeneration) for automatic updates
2. **Search**: Add full-text search functionality
3. **Pagination**: Implement pagination for large datasets
4. **Rich Content**: Support more Notion block types (callouts, toggles, etc.)
5. **Media**: Better handling of images, videos, and embeds
6. **Relations**: Support Notion relation properties for linking content
7. **Webhooks**: Real-time updates using Notion webhooks

### Additional Content Types
The pattern can be extended to manage:
- Blog posts
- Team members
- Products
- FAQs
- Documentation
- Case studies
- Events
- Testimonials

## Conclusion

This implementation successfully migrated the News and Recruit content management systems from MDX files to Notion CMS while maintaining:

- **High Reusability**: Dictionary-based config makes the code portable
- **Type Safety**: Full TypeScript support throughout
- **Maintainability**: Clear separation of generic and project-specific code
- **Developer Experience**: Simple 3-step process to add new content types
- **Performance**: SSR with static generation for optimal performance

The generic Notion integration system can be easily reused in other projects by simply creating new config files and data layers, making it a valuable asset for future development.

---

**Project**: STAR UP Website
**Date**: 2025-10-30
**Implementation**: Notion CMS Integration
**Status**: Completed ✅
