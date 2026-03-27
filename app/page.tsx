'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { initTF } from './tfjs'
import styles from './page.module.css'

type Prediction = {
  className: string
  probability: number
}

type ModelStatus = 'idle' | 'loading' | 'ready' | 'error'

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [results, setResults] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [modelStatus, setModelStatus] = useState<ModelStatus>('idle')
  const [modelError, setModelError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const imageRef = useRef<HTMLImageElement | null>(null)
  const modelRef = useRef<mobilenet.MobileNet | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const urlObjectRef = useRef<string | null>(null)

  // 初始化模型
  useEffect(() => {
    let isMounted = true
    
    async function setup() {
      setModelStatus('loading')
      try {
        await initTF()
        const model = await mobilenet.load()
        if (isMounted) {
          modelRef.current = model
          setModelStatus('ready')
        }
      } catch (err) {
        console.error('Model loading error:', err)
        if (isMounted) {
          setModelStatus('error')
          setModelError(err instanceof Error ? err.message : '模型加载失败')
        }
      }
    }
    setup()

    return () => {
      isMounted = false
    }
  }, [])

  // 组件卸载时清理所有blob URL
  useEffect(() => {
    return () => {
      if (urlObjectRef.current) {
        URL.revokeObjectURL(urlObjectRef.current)
        urlObjectRef.current = null
      }
    }
  }, [])

  const setImageUrlSafe = useCallback((url: string | null, isBlobUrl = false) => {
    // 先保存旧的URL用于稍后释放
    const oldUrl = urlObjectRef.current
    
    // 如果是blob URL，记录它
    if (isBlobUrl && url) {
      urlObjectRef.current = url
    } else if (!isBlobUrl) {
      urlObjectRef.current = null
    }
    
    // 更新状态
    setImageUrl(url)
    setResults([])
    setImageLoaded(false)
    setImageError(false)
    
    // 延迟释放旧URL，确保新图片已经加载
    if (oldUrl && oldUrl !== url) {
      setTimeout(() => {
        URL.revokeObjectURL(oldUrl)
      }, 1000)
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('请选择有效的图片文件')
      return
    }
    
    const url = URL.createObjectURL(file)
    setImageUrlSafe(url, true)
    e.target.value = ''
  }, [setImageUrlSafe])

  const handleUrlSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!urlInput.trim()) return
    
    setImageUrlSafe(urlInput.trim())
    setUrlInput('')
    setShowUrlInput(false)
  }, [urlInput, setImageUrlSafe])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const file = e.dataTransfer.files?.[0]
    if (!file) return
    
    if (!file.type.startsWith('image/')) {
      alert('请拖放有效的图片文件')
      return
    }
    
    const url = URL.createObjectURL(file)
    setImageUrlSafe(url, true)
  }, [setImageUrlSafe])

  const handleClear = useCallback(() => {
    // 立即释放当前blob URL
    if (urlObjectRef.current) {
      URL.revokeObjectURL(urlObjectRef.current)
      urlObjectRef.current = null
    }
    setImageUrlSafe(null)
  }, [setImageUrlSafe])

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true)
    setImageError(false)
  }, [])

  const handleImageError = useCallback(() => {
    setImageLoaded(false)
    setImageError(true)
    alert('图片加载失败，请检查图片URL或重新上传')
  }, [])

  const handlePredict = useCallback(async () => {
    if (!modelRef.current || !imageRef.current) return
    
    if (!imageLoaded || imageError) {
      alert('请等待图片加载完成')
      return
    }

    try {
      setLoading(true)
      const predictions = await modelRef.current.classify(imageRef.current, 5)
      setResults(predictions)
    } catch (err) {
      console.error('Predict error:', err)
      alert('预测失败，请重试')
    } finally {
      setLoading(false)
    }
  }, [imageLoaded, imageError])

  const getStatusText = () => {
    switch (modelStatus) {
      case 'loading': return '模型加载中...'
      case 'ready': return '模型已就绪'
      case 'error': return '模型加载失败'
      default: return '初始化中...'
    }
  }

  const getStatusIcon = () => {
    switch (modelStatus) {
      case 'loading': return '⏳'
      case 'ready': return '✓'
      case 'error': return '✗'
      default: return '○'
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.bgGradient} />
      <div className={styles.bgGrid} />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
            </div>
            <h1 className={styles.title}>Vision<span className={styles.titleAccent}>AI</span></h1>
          </div>
          <div className={`${styles.status} ${styles[modelStatus]}`}>
            <span className={styles.statusIcon}>{getStatusIcon()}</span>
            <span className={styles.statusText}>{getStatusText()}</span>
          </div>
        </header>

        <section className={styles.uploadSection}>
          {!imageUrl ? (
            <div
              className={`${styles.dropZone} ${isDragging ? styles.dragging : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className={styles.hiddenInput}
              />
              <div className={styles.dropZoneContent}>
                <div className={styles.uploadIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                </div>
                <p className={styles.dropZoneTitle}>拖放图片到这里</p>
                <p className={styles.dropZoneSubtitle}>或点击选择文件</p>
                <div className={styles.divider}>
                  <span>OR</span>
                </div>
                <button
                  type="button"
                  className={styles.urlButton}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowUrlInput(true)
                  }}
                >
                  输入图片URL
                </button>
              </div>
            </div>
          ) : (
            <div className={styles.previewContainer}>
              <div className={styles.previewWrapper}>
                {!imageLoaded && !imageError && (
                  <div className={styles.imageLoading}>
                    <span className={styles.spinner} />
                    <p>图片加载中...</p>
                  </div>
                )}
                {imageError && (
                  <div className={styles.imageError}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <p>图片加载失败</p>
                  </div>
                )}
                <img
                  ref={imageRef}
                  src={imageUrl}
                  alt="预览"
                  className={styles.previewImage}
                  onLoad={handleImageLoad}
                  onError={handleImageError}
                  style={{ opacity: imageLoaded ? 1 : 0 }}
                />
                <button className={styles.clearButton} onClick={handleClear}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </section>

        {showUrlInput && (
          <div className={styles.modalOverlay} onClick={() => setShowUrlInput(false)}>
            <form className={styles.modal} onClick={(e) => e.stopPropagation()} onSubmit={handleUrlSubmit}>
              <h3>输入图片URL</h3>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className={styles.urlInput}
                autoFocus
              />
              <div className={styles.modalActions}>
                <button type="button" className={styles.modalCancel} onClick={() => setShowUrlInput(false)}>
                  取消
                </button>
                <button type="submit" className={styles.modalConfirm} disabled={!urlInput.trim()}>
                  确认
                </button>
              </div>
            </form>
          </div>
        )}

        {imageUrl && (
          <section className={styles.actionSection}>
            <button
              className={`${styles.predictButton} ${loading ? styles.loading : ''}`}
              disabled={modelStatus !== 'ready' || loading || !imageLoaded || imageError}
              onClick={handlePredict}
            >
              {loading ? (
                <>
                  <span className={styles.spinner} />
                  分析中...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                  </svg>
                  开始识别
                </>
              )}
            </button>
          </section>
        )}

        {modelStatus === 'error' && (
          <div className={styles.errorMessage}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{modelError || '模型加载失败，请刷新页面重试'}</span>
          </div>
        )}

        {results.length > 0 && (
          <section className={styles.resultsSection}>
            <h2 className={styles.resultsTitle}>识别结果</h2>
            <div className={styles.resultsList}>
              {results.map((item, index) => (
                <div key={index} className={styles.resultCard} style={{ animationDelay: `${index * 100}ms` }}>
                  <div className={styles.resultRank}>{index + 1}</div>
                  <div className={styles.resultInfo}>
                    <div className={styles.resultName}>{item.className}</div>
                    <div className={styles.resultBar}>
                      <div
                        className={styles.resultProgress}
                        style={{ width: `${item.probability * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className={styles.resultScore}>{(item.probability * 100).toFixed(1)}%</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>Powered by TensorFlow.js & MobileNet</p>
      </footer>
    </div>
  )
}