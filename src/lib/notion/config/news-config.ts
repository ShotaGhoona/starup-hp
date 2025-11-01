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
}
