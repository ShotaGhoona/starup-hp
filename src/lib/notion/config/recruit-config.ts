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
    thumbnail: {
      name: 'Thumbnail',
      type: 'files',
    },
  },
}
