/**
 * Generic Notion Property Extraction System
 * Automatically extracts properties based on DatabaseConfig
 */

import { NotionPage, DatabaseConfig, NotionPropertyType } from './types'

/**
 * Extraction logic by property type
 */
const extractorsByType: Record<NotionPropertyType, (page: NotionPage, propertyName: string) => any> = {
  title: (page, propertyName) => {
    return page.properties[propertyName]?.title?.[0]?.plain_text || ''
  },

  rich_text: (page, propertyName) => {
    return page.properties[propertyName]?.rich_text?.[0]?.plain_text || ''
  },

  number: (page, propertyName) => {
    const value = page.properties[propertyName]?.number
    return value !== null && value !== undefined ? value : null
  },

  unique_id: (page, propertyName) => {
    const number = page.properties[propertyName]?.unique_id?.number
    return number !== undefined ? String(number) : ''
  },

  select: (page, propertyName) => {
    return page.properties[propertyName]?.select?.name || ''
  },

  multi_select: (page, propertyName) => {
    return page.properties[propertyName]?.multi_select?.map((item: { name: string; id: string; color: string }) => item.name) || []
  },

  date: (page, propertyName) => {
    return page.properties[propertyName]?.date?.start || ''
  },

  checkbox: (page, propertyName) => {
    return page.properties[propertyName]?.checkbox || false
  },

  url: (page, propertyName) => {
    return page.properties[propertyName]?.url || ''
  },

  email: (page, propertyName) => {
    return page.properties[propertyName]?.email || ''
  },

  phone_number: (page, propertyName) => {
    return page.properties[propertyName]?.phone_number || ''
  },

  files: (page, propertyName) => {
    const files = page.properties[propertyName]?.files
    if (!files || files.length === 0) {
      return ''
    }

    const file = files[0]
    if (file.type === 'file' && file.file) {
      return file.file.url
    } else if (file.type === 'external' && file.external) {
      return file.external.url
    }

    return ''
  },
}

/**
 * Auto-generate extractor functions from DatabaseConfig
 */
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

    extractors[key] = (page: NotionPage) => {
      return extractorFn(page, propertyName)
    }
  }

  return extractors as Record<keyof T['properties'], (page: NotionPage) => any>
}

/**
 * Get Database ID helper
 */
export function getDatabaseId(config: DatabaseConfig): string {
  const { id } = config.database
  return typeof id === 'function' ? id() : id
}

/**
 * Get default sorts helper
 */
export function getDefaultSorts(config: DatabaseConfig) {
  return config.database.defaultSorts || []
}
