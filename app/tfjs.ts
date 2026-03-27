import * as tf from '@tensorflow/tfjs'
import '@tensorflow/tfjs-backend-wasm'
import { setWasmPaths } from '@tensorflow/tfjs-backend-wasm'

let initialized = false

export async function initTF() {
  // 设置WASM文件路径，使用相对于网站根目录的路径
  if (typeof window !== 'undefined') {
    const baseUrl = window.location.origin
    setWasmPaths(`${baseUrl}/tfjs/`)
  }
  
  if (initialized) return

  try {
    await tf.setBackend('wasm')
    await tf.ready()
    initialized = true
    console.log('TFJS backend:', tf.getBackend())
  } catch (error) {
    console.error('WASM backend failed, falling back to CPU:', error)
    // 如果WASM失败，回退到CPU后端
    await tf.setBackend('cpu')
    await tf.ready()
    initialized = true
    console.log('TFJS backend (fallback):', tf.getBackend())
  }
}
