import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Image Classifier',
  description: 'TensorFlow.js + WASM Image Classifier',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
