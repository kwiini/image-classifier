'use client'

import { useEffect, useRef, useState } from 'react'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { initTF } from './tfjs'
import styles from './page.module.css'

type Prediction = {
  className: string
  probability: number
}

export default function Home() {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [results, setResults] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  const imageRef = useRef<HTMLImageElement | null>(null)
  const modelRef = useRef<mobilenet.MobileNet | null>(null)

  /** 初始化 tfjs + 加载模型（只做一次） */
  useEffect(() => {
    async function setup() {
      await initTF()
      modelRef.current = await mobilenet.load()
      setModelLoaded(true)
      console.log('MobileNet loaded')
    }
    setup()
  }, [])

  /** 上传图片 */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageUrl(URL.createObjectURL(file))
    setResults([])
  }

  /** 执行预测 */
  async function handlePredict() {
    if (!modelRef.current || !imageRef.current) return

    try {
      setLoading(true)

      const predictions = await modelRef.current.classify(
        imageRef.current,
        3
      )

      setResults(predictions)
    } catch (err) {
      console.error('Predict error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Image Classifier</h1>

        {/* 上传 */}
        <div className={styles.section}>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        {/* 预览 */}
        {imageUrl && (
          <div className={styles.section}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageUrl}
              alt="preview"
              className={styles.preview}
            />
          </div>
        )}

        {/* 按钮 */}
        <div className={styles.section}>
          <button
            className={styles.button}
            disabled={!modelLoaded || !imageUrl || loading}
            onClick={handlePredict}
          >
            {loading ? 'Predicting...' : 'Start Predict'}
          </button>
        </div>

        {/* 结果 */}
        <div className={styles.section}>
          <div className={styles.results}>
            {results.map((item, index) => (
              <div key={index} className={styles.resultItem}>
                <span>{item.className}</span>
                <span>{(item.probability * 100).toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
