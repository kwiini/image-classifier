/* eslint-disable @next/next/no-page-custom-font */
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VisionAI - 图像识别',
  description: '基于 TensorFlow.js 和 MobileNet 的智能图像识别应用',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;700&display=swap" rel="stylesheet" />

      </head>
      <body style={{ fontFamily: "'Inter', 'Space Grotesk', system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  )
}