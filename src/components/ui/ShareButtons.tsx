/**
 * ShareButtons Component
 * ソーシャルメディアシェアボタンコンポーネント
 */

'use client'

interface ShareButtonsProps {
  url?: string
  title: string
  variant?: 'horizontal' | 'vertical'
  className?: string
}

type SocialPlatform = 'x' | 'facebook' | 'linkedin' | 'line'

/**
 * ソーシャルメディアシェアハンドラー
 */
function handleShare(platform: SocialPlatform, url: string, title: string) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const shareUrls: Record<SocialPlatform, string> = {
    x: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
  }

  window.open(shareUrls[platform], '_blank', 'width=550,height=420')
}

/**
 * ソーシャルメディアアイコン定義
 */
const socialIcons: Record<
  SocialPlatform,
  { label: string; path: string }
> = {
  x: {
    label: 'X',
    path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
  facebook: {
    label: 'Facebook',
    path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  },
  linkedin: {
    label: 'LinkedIn',
    path: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  },
  line: {
    label: 'LINE',
    path: 'M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314',
  }
}

/**
 * ShareButtonsコンポーネント
 */
export default function ShareButtons({
  url,
  title,
  variant = 'horizontal',
  className = '',
}: ShareButtonsProps) {
  // URLが指定されていない場合は現在のページURLを使用
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

  const platforms: SocialPlatform[] = ['x', 'facebook', 'linkedin', 'line']

  const containerClass =
    variant === 'horizontal'
      ? 'flex flex-wrap gap-3'
      : 'flex flex-col gap-3'

  const buttonClass =
    variant === 'horizontal'
      ? 'flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors'
      : 'flex items-center gap-3 p-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded transition-colors'

  return (
    <div className={`${containerClass} ${className}`}>
      {platforms.map((platform) => {
        const icon = socialIcons[platform]
        return (
          <button
            key={platform}
            onClick={() => handleShare(platform, shareUrl, title)}
            className={buttonClass}
            aria-label={`Share on ${icon.label}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d={icon.path} />
            </svg>
            {icon.label}
          </button>
        )
      })}
    </div>
  )
}
