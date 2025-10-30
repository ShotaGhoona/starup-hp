/**
 * News型定義
 * アプリケーション全体で使用するニュース関連の型定義
 */

/**
 * ニュース記事の完全なデータ型
 * 詳細ページで使用
 */
export interface NewsPost {
  /** 記事ID（Notionのunique_id.numberを文字列化） */
  id: string
  /** 記事タイトル */
  title: string
  /** 公開日（YYYY-MM-DD形式） */
  date: string
  /** カテゴリタグ（複数） */
  tags: string[]
  /** 記事概要 */
  summary: string
  /** 記事本文（Markdown） */
  content: string
  /** サムネイル画像URL */
  thumbnail: string
}

/**
 * ニュース一覧表示用のデータ型
 * 一覧ページで使用（本文を含まない軽量版）
 */
export interface NewsListItem {
  /** 記事ID */
  id: string
  /** 記事タイトル */
  title: string
  /** 公開日（YYYY-MM-DD形式） */
  date: string
  /** カテゴリタグ（複数） */
  tags: string[]
  /** 記事概要 */
  summary: string
  /** サムネイル画像URL */
  imageUrl: string
}
